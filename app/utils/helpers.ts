import { Platform } from '~/shared/types';

export class HelperService {
  static getPlatform(): Platform {
    return process.versions['electron'] ? 'desktop' : 'web';
  }

  static convertToLapTime(seconds: number) {
    let minutes = Number(Math.floor(seconds / 60));
    let extraSeconds = seconds % 60;
    return `${minutes}:${extraSeconds.toFixed(2)}`;
  }
}
