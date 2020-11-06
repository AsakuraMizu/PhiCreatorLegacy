import howler from 'howler';
import Howl = howler.Howl;
import { getBase64 } from './utils';

export default class AudioPlayer {
  music?: Howl;

  get progress(): number {
    return this.music ? <number> this.music.seek() / this.music.duration() : 0;
  }

  pause(paused: boolean): void {
    if (paused) {
      this.music?.pause();
    } else {
      this.music?.play();
    }
  }

  destroy(): void {
    this.music?.stop();
  }

  async setup(file: File): Promise<void> {
    if (file) {
      this.music = await this.load(file);
    }
  }

  private async load(file: File) {
    return new Howl({
      src: await getBase64(file),
    });
  }
}
