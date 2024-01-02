import { Platform } from '~/shared/types';

export const getPlatform = (): Platform => {
  return process.versions['electron'] ? 'desktop' : 'web';
};
