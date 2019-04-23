import { InodeTable } from '../../../../interface/nodeTable.interface';
import { IDFConv } from '../../../../../core/interface/dfconv.interface';
import { Inode } from "../../../../../core/middleware/graph";
import { Parameters, MediaObjectOptions } from 'actions-on-google';

interface Iparam extends Parameters {
  title: string;
  author?: string;
  reference?: string;
  chapter?: string;
}

export const getBook: Inode = {
  intent: false,
  name: 'listen.getBook',
  test: async (conv: IDFConv): Promise<keyof InodeTable> => {
    const { title, author, reference, chapter }: Iparam = conv.parameters as Iparam;
    await conv.middleware.api.search(conv, title, author);
    conv.middleware.db.session.data.titleTellByUser = title;
    conv.middleware.db.session.data.authorTellByUser = author || '';
    conv.middleware.db.session.data.refTellByUser = reference || '';
    conv.middleware.db.session.data.chapterTellByUser = chapter || '';
    if (conv.middleware.db.session.api.search.length > 1) {
      /**
       * redirect to select num of book in the list
       */
      return 'listen.selectBook';
    } else if (conv.middleware.db.session.api.search.length === 1) {
      /**
       * redirect to play ref
       */
      conv.middleware.db.session.data.bookIndex = 0;
      return 'listen.RefPlay';
    }
    /**
     * redirect to fallback
     */
    return 'listen.error';
  },
};

// move to choice context with dedicated folder
export const selectBook: Inode = {
  intent: false,
  name: 'listen.selectBook',
  context: {
    name: 'choice',
    return: 'listen.checkSelectBook',
  },
  return: true,
  conv: {
    arg: (conv: IDFConv): string[] =>
      conv.middleware.db.session.api.search.map(
        (webpub, index) =>
          `numero ${index + 1} ${webpub.metadata.title} de ${webpub.metadata.author}`),
    ask: 'choice.select_book',
  },
};

export const checkSelectBook: Inode = {
  intent: false,
  name: 'listen.checkSelectBook',
  return: false,
  test: (conv: IDFConv): keyof InodeTable => {
    const c = conv.middleware.db.session.data.context.choice;
    const l = conv.middleware.db.session.api.search.length;
    if (c > 0 && c <= l) {
      conv.middleware.db.session.data.bookIndex = c;
      return 'listen.IsRefPlay';
    } else {
      // error wrong choice selectBook
      return 'listen.selectBook';
    }
  }
};

export const isRefToPlay: Inode = {
  intent: false,
  name: 'listen.IsRefPlay',
  return: false,
  test: (conv: IDFConv): keyof InodeTable => {
    if (conv.middleware.db.session.data.refTellByUser) {
      return 'listen.RefPlay';
    }
    return 'listen.checkAlreadyListen';
  }
};

export const checkAlreadyListen: Inode = {
  intent: false,
  name: 'listen.checkAlreadyListen',
  return: false,
  test: (conv: IDFConv): keyof InodeTable => {
    const db = conv.middleware.db;
    try {
      if (db.user.data.bookAlreadyListen
        [db.session.api.search
          [db.session.data.bookIndex].metadata.identifier]) {
            return 'listen.alreadyListen';
      }
    } catch(e) {}
    return 'listen.play';
  },
};

export const alreadyListen: Inode = {
  intent: false,
  name: 'listen.alreadyListen',
  return: false,
  context: {
    name: 'yes_no',
    return: 'listen.returnAlreadyListen'
  },
  conv: {
    arg: (conv: IDFConv) => 
    [conv.middleware.db.session.api.search[conv.middleware.db.session.data.bookIndex].metadata.title,
      (conv.middleware.db.session.data.trackIndex + 1).toString()],
    ask: 'yesno.already_listen',
  }
};

export const returnAlreadyListen: Inode = {
  intent: false,
  name: 'listen.returnAlreadyListen',
  return: false,
  test: (conv: IDFConv): keyof InodeTable => {
    if (conv.middleware.db.session.data.context.yes_no) {
      conv.middleware.db.session.data.trackIndex = 
        conv.middleware.db.user.data.bookAlreadyListen
          [conv.middleware.db.session.data.bookIndex].chapter;
    }
    return 'listen.play';
  }
};

export const play: Inode = {
  intent: false,
  name: 'listen.play',
  return: true,
  test: (conv) => {
    // trig the timer to save time elapsed
    return 'listen.play';
  },
  conv: {
    media: (conv: IDFConv): MediaObjectOptions => ({
      url: `${conv.middleware.db.session.api.search
        [conv.middleware.db.session.data.bookIndex].readingOrder
          [conv.middleware.db.session.data.trackIndex].href}#t=${conv.middleware.db.session.data.timecode.toString()}`,
      /* set description, name and image in the future */
    })
  }
};

export const endOfBook: Inode = {
  intent: false,
  name: 'listen.endOfBook',
  return: false,
  test: () => 'start_intent',
  conv: {
    ask: 'listen.end_of_book',
  }
};