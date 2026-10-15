import type { SharedTranslation } from '../schema';

export const SHARED_TRANSLATION = {
  navigation: {
    label: 'Primary navigation',
    home: 'Home',
    health: 'Health',
  },
  health: {
    title: 'Health',
    description: 'Check whether the API is available.',
    actionLabel: 'Check API health',
    loadingLabel: 'Checking API health…',
    statusLabel: 'API status:',
  },
} as const satisfies SharedTranslation;
