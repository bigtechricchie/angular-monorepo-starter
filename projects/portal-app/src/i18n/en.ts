import { SHARED_TRANSLATION } from '@lib/i18n';

import type { PortalTranslation } from './schema';

export const PORTAL_TRANSLATION = {
  ...SHARED_TRANSLATION,
  app: {
    title: 'Portal App',
  },
  home: {
    title: 'Home',
    description: 'Application portal.',
    healthLink: 'Check API health status',
  },
} as const satisfies PortalTranslation;
