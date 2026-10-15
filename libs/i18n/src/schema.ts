export interface SharedTranslation {
  readonly navigation: NavigationTranslation;
  readonly health: HealthTranslation;
}

export interface NavigationTranslation {
  readonly label: string;
  readonly home: string;
  readonly health: string;
}

export interface HealthTranslation {
  readonly title: string;
  readonly description: string;
  readonly actionLabel: string;
  readonly loadingLabel: string;
  readonly statusLabel: string;
}
