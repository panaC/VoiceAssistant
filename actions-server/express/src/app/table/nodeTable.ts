import * as node from './../graph';
import * as start from './../graph/start/index';
import * as listen from './../graph/start/listen/index';
import { InodeTable } from './../interface/nodeTable.interface';

export const nodeTable = (): InodeTable => ({
  'start_intent': node.start,

  'start.newBooks_intent': start.newBooks,
  'start.help_intent': start.help,
  'start.listen_intent': listen.start,

  'listen.error': listen.error,
  'listen.getBook': listen.getBook,
  'listen.selectBook': listen.selectBook,
  'listen.checkSelectBook': listen.checkSelectBook,
  'listen.IsRefPlay': listen.isRefToPlay,
  'listen.RefPlay':,
  'listen.refAskPlay':,
  'listen.refResponsePlay':,
  'listen.refSetPlay':,
  'listen.checkAlreadyListen': listen.checkAlreadyListen,
  'listen.alreadyListen': listen.alreadyListen,
  'listen.returnAlreadyListen': listen.returnAlreadyListen,
  'listen.play': listen.play,
  'listen.endOfBook':,
  'listen.rePlay_intent':,
  'listen.stopPlay_intent':,
  'listen.mediaStatus_intent': listen.mediaStatus,
  'listen.pausePlay_intent':,
  'listen.nextChapter_intent':,
  'listen.prevChapter_intent':,
  'listen.fallback_intent': listen.fallback,
  'listen.noInput_intent': listen.noInput,
  'listen.cancel_intent': listen.cancel,

  'choice.getNumber_intent':,

  'choice.control.noInput_intent':,
  'choice.control.cancel_intent':,
  'choice.control.fallback_intent':,
  'choice.control.error':,

  'yesno.get_intent':,

  'yesno.control.noInput_intent':,
  'yesno.control.cancel_intent':,
  'yesno.control.fallback_intent':,
  'yesno.control.error':,

  'fallback_intent': node.fallback,
  'noInput_intent': node.noInput,
  'cancel_intent': node.cancel,
  'error': node.error,
});
