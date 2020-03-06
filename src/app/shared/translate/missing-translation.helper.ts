import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

export class MissingTranslationHelper implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.log('bla', params);
    if (params.interpolateParams) {
      return (params.interpolateParams as any).default || params.key;
    }
    return params.key;
  }
}
