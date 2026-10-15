import type { SharedTranslation } from '@lib/i18n';

export interface ReferenceTranslation extends SharedTranslation {
  readonly app: ReferenceAppTranslation;
  readonly home: ReferenceHomeTranslation;
}

export interface ReferenceAppTranslation {
  readonly title: string;
}

export interface ReferenceHomeTranslation {
  readonly title: string;
  readonly description: string;
  readonly healthLink: string;
}
