/*
 * File: core.ts
 * Project: VoiceAssistant
 * File Created: Saturday, 30th March 2019 2:52:43 pm
 * Author: pierre (p.leroux@gmx.com)
 * -----
 * Last Modified: Saturday, 30th March 2019 2:52:45 pm
 * Modified By: pierre (p.leroux@gmx.com>)
 * -----
 * Copyright 2019 - 2019 EDRLab.org
 * Use of this source code is governed by a BSD-style license
 */

import { Istate, IstateName } from '../interface/state.interface';
import { state } from '../app/state';
import { DFConv } from '../app/app';
import { MAE_LOOP_MAX } from './../constants';
import i18n from 'i18n';
import { join } from 'path';
import { debug } from './../utils/debug';

i18n.configure({
  directory: join(__dirname, '../locales'),
  objectNotation: true,
  fallbacks: {
    'fr-FR': 'fr',
    'fr-CA': 'fr',
    'en-US': 'en',
    'en-GB': 'en',
  },
  defaultLocale: 'fr',
});

export const translate = (str: string): string => i18n.__(str);

export const setLocale = (local: string) => { i18n.setLocale(local); };

export class Core {

  private _state: Istate = state;
  private _currentState: IstateName = null;
  private _currentResult: string = '';

  constructor(public _conv: DFConv) {

  }

  set state(s: string) {
    this._conv.session.state = s;
  }

  get state() {
    return this._conv.session.state;
  }

  private findState(): void {
    let path = this.state;
    path = path.replace(/\./gi, '.children.');
    if (path === '') {
      path = 'start';
    }

    debug.core.log('path:', path);

    try {
      this._currentState = eval(`this._state.${path}`) || this._state.error;
    } catch {
      this._currentState = this._state.error;
    }
    debug.core.log('currentState:', this._currentState);

  }

  private async execFct(): Promise<void> {
    if (this._currentState.fct) {
      // https://stackoverflow.com/questions/49525389/element-implicitly-has-an-any-type-because-type-0-has-no-index-signature
      const tmp = eval(`this._conv.${this._currentState.fct}`);
      debug.core.log('tmp:', tmp);
      this._currentResult = '';
      if (typeof tmp === 'function') {
        // handle if function is async
        this._currentResult = tmp();
      } else if (typeof tmp === 'string') {
        this._currentResult = tmp;
      }
    }
    debug.core.log('exect-fct res:', this._currentResult);
  }

  private execSwitch(): void {
    if (this._currentState.switch[this._currentResult]) {
      this.state = this._currentState.switch[this._currentResult] as string;
    } else {
      this.state = this._currentState.switch.default;
    }
    debug.core.log('switch:', this.state);
  }

  private convHandle(): void {
    // handle all conv object in state
    const conv = this._currentState.conv;
    if (conv) {
      if (conv.ask) {
        this._conv.ask(translate(conv.ask as string));
      }
      if (conv.close) {
        this._conv.close(translate(conv.close));
      }
    }
  }

  public async main(loop: number = 0): Promise<void> {

    if (loop > MAE_LOOP_MAX) {
      this._conv.close('error loop');
      return;
    }

    // await this._conv.session.waitInit;

    /*
     * 1/ found in graph the stateName
          logic context.context.context.name
          a name become a context when it have at least one children
     * 2/ exec the fcts if exists
     * 3/ save the state name in function of string returned
     * 4/ set the conv.ask / close / suggestion
     * 5/ if return is set : quit recursive loop
     *      else call main with loop increment (recursive mode)
     * 6/ end
     */

    debug.core.log('main:start');

    this.findState();
    await this.execFct();
    this.execSwitch();
    this.convHandle();

    if (!this._currentState.return) {
      debug.core.log('main:end-loop');
      return this.main(++loop);
    }

    if (this._currentState.context) {
      debug.core.log('context-set:', this._currentState.context);
      this._conv.contexts.set(this._currentState.context as string, 10);
    }

    debug.core.log('main:end');

    await this._conv.session.save();
  }
}