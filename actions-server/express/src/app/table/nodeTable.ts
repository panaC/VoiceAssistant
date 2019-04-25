import * as node from './../graph';
import * as start from './../graph/start/index';
import * as listen from './../graph/start/listen/index';
import * as play from './../graph/start/play/index';
import * as choice from './../graph/start/choice/index';
import * as yesno from './../graph/start/yesno/index';
import { InodeTable } from './../interface/nodeTable.interface';

export const START_DEFAULT_INTENT: keyof InodeTable = 'start_intent';

export const nodeTable = (): InodeTable => ({
  'start_intent': node.start, // ok

  'start.newBooks_intent': start.newBooks, // ok
  'start.help_intent': start.help, // ok
  'start.listen_intent': listen.start, // ok

  'listen.getBook': listen.getBook,
  'listen.bookNotFound': listen.bookNotFound,
  'listen.selectBook': listen.selectBook,
  'listen.checkSelectBook': listen.checkSelectBook,
  'listen.isRefPlay': listen.isRefToPlay,
  'listen.refPlay': listen.refPlay,
  'listen.refAskPlay': listen.refAskPlay,
  'listen.refResponsePlay': listen.refResponsePlay,
  'listen.refSetPlay': listen.refSetPlay,
  'listen.checkAlreadyListen': listen.checkAlreadyListen,
  'listen.alreadyListen': listen.alreadyListen,
  'listen.returnAlreadyListen': listen.returnAlreadyListen,

  'listen.control.fallback_intent': listen.fallback,
  'listen.control.noInput_intent': listen.noInput,
  'listen.control.cancel_intent': listen.cancel,
  'listen.control.error': listen.error,

  'play.play': play.play,
  'play.endOfBook': play.endOfBook,
  'play.rePlay_intent': play.rePlayIntent, // ok
  'play.stopPlay_intent': play.stopPlayIntent, // ok
  'play.mediaStatus_intent': play.mediaStatusIntent, // ok
  'play.pausePlay_intent': play.pausePlayIntent, // ok
  'play.nextChapter_intent': play.nextChapterIntent, // ok
  'play.prevChapter_intent': play.prevChapterIntent, // ok

  'play.control.fallback_intent': play.fallback,
  'play.control.noInput_intent': play.noInput,
  'play.control.cancel_intent': play.cancel,
  'play.control.error': play.error,

  'choice.getNumber_intent': choice.getNumberIntent, // ok

  'choice.control.noInput_intent': choice.noInputIntent, // ok
  'choice.control.cancel_intent': choice.cancelIntent, // ok
  'choice.control.fallback_intent': choice.fallbackIntent, // ok
  'choice.control.error': choice.error,

  'yesno.getYes_intent': yesno.getYesIntent,
  'yesno.getNo_intent': yesno.getNoIntent,

  'yesno.control.noInput_intent': yesno.noInputIntent,
  'yesno.control.cancel_intent': yesno.cancelIntent,
  'yesno.control.fallback_intent': yesno.fallbackIntent,
  'yesno.control.error': yesno.error,

  'fallback_intent': node.fallbackIntent, // ok
  'noInput_intent': node.noInputIntent, // ok
  'cancel_intent': node.cancelIntent, // ok
  'error': node.error,
});
