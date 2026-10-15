import type { SharedTranslation } from '@lib/i18n';

export interface PortalTranslation extends SharedTranslation {
  readonly app: PortalAppTranslation;
  readonly home: PortalHomeTranslation;
}

export interface PortalAppTranslation {
  readonly title: string;
}

export interface PortalHomeTranslation {
  readonly title: string;
  readonly description: string;
  readonly healthLink: string;
}
