/*
 * File: constants.ts
 * Project: VoiceAssistant
 * File Created: Wednesday, 6th February 2019 11:19:55 am
 * Author: pierre (p.leroux@gmx.com)
 * -----
 * Last Modified: Wednesday, 6th February 2019 11:19:59 am
 * Modified By: pierre (p.leroux@gmx.com>)
 * -----
 * Copyright 2019 - 2019 EDRLab.org
 * Use of this source code is governed by a BSD-style license
 */

export const PORT = process.env.PORT_ACTIONS_SERVER || 4000;

export const SERVER_NAME = process.env.NAME_ACTIONS_SERVER || 'Actions-Server';

export const ENTRY_POINT = '/fulfillment';

export const SERVER_URL = process.env.OPDS_SERVER_URL || 'http://127.0.0.1:3000/webpub';
export const DB_URL = process.env.COUCHDB_URL || 'http://127.0.0.1:5984';

export const SEARCH = (title: string, author: string = '') => 
  `${SERVER_URL}?q=title:${encodeURI(title)}${author !== '' ? ` AND author:${author}` : ''}`;
export const REF = (identifier: string, ref: string) => `${SERVER_URL}/${identifier}?q=${encodeURI(ref)}`;

export const MAE_LOOP_MAX = 100;

export const INTENT_START_NAME = 'start';