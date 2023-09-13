export interface ExternalScript {
  name: string;
  src: string;
}

export enum ExternalScriptsNames {
  ALTMETRIC = 'altmetric-embed',
}

export enum ExternalScriptsStatus {
  LOADED = 'loaded',
  ALREADY_LOADED = 'already loaded',
  NOT_LOADED = 'not loaded',
}

export const ExternalScriptsList: ExternalScript[] = [
  {
    name: ExternalScriptsNames.ALTMETRIC,
    src: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js',
  },
];
