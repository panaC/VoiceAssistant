import { InodeTable } from './../interface/nodeTable.interface';
import * as node from './../graph';
import * as start from './../graph/start/index';
import * as listen from './../graph/start/listen/index';

export const nodeTable = (): InodeTable => (
  {
    start: node.start,

    startHelp: start.help,
    startListen: start.listen,
    startNewBooks: start.newBooks,

    listenError: listen.error,

    fallback: node.fallback,
    error: node.error,
  });
