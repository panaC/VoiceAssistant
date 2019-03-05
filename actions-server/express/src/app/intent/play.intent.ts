import { getAudiobook, Eaudiobook } from './../service/audiobook.service';
import { DFConv } from './../app';
import { prompts } from '../prompt';

export const play = async (conv: DFConv) => {
  if (!conv.utils.isCompatible()) {
    return ;
  }

  if (!conv.data.media ||
    conv.data.currentChapter >= conv.data.media.numberOfChapter ||
    conv.data.currentChapter < 0) {
    conv.data.currentChapter = 0;
  }
  const { audiobook } = conv.parameters;
  if (audiobook && audiobook !== '') {
    conv.data.currentName = audiobook as string;
  }
  try {
    const media = await getAudiobook(conv.data.currentName, conv.data.currentChapter);
    conv.data.media = media;
    if (media.state === Eaudiobook.OK) {
      conv.contexts.set('playing_audiobook', 999);
      conv.utils.media(media,
        (conv.data.currentChapter === 0 ?
          prompts.play_first :
          prompts.play_follow),
        conv.data.currentName);
    } else {
      throw media.state.toString();
    }
  } catch (e) {
    conv.utils.ask(prompts.error, e);
  }
};

export const playPrev = async (conv: DFConv) => {
  conv.data.currentChapter -= 2;
  await play(conv);
};

export const playNext = async (conv: DFConv) => {
  ++conv.data.currentChapter;
  await play(conv);
};
