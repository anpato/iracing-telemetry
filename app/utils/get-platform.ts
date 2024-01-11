import electron from '~/electron.server';
import { Platform } from '~/shared/types';

export const getPlatform = (): Platform => {
  try {
    return electron.app.getName() ? 'desktop' : 'web';
  } catch (error) {
    return 'web';
  }
};
