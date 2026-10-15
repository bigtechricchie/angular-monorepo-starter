import { SHARED_TRANSLATION } from '@lib/i18n';

import type { ReferenceTranslation } from './schema';

export const REFERENCE_TRANSLATION = {
  ...SHARED_TRANSLATION,
  app: {
    title: 'Reference App',
  },
  home: {
    title: 'Architecture reference',
    description:
      'An executable architecture guide and UI styleguide that demonstrates the canonical composition patterns of the monorepo starter.',
    healthLink: 'View API health',
  },
} as const satisfies ReferenceTranslation;
