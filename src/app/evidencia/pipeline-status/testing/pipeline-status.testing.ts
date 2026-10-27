import { TranslateLoader } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

/**
 * Loader de tradução vazio para os testes desta pasta. Local de propósito: mantém
 * os specs sem nenhum import para fora da feature, então eles rodam igual em outra
 * instalação. Com o dicionário vazio, as asserções comparam a própria chave i18n.
 */
export class PipelineStatusTranslateLoaderStub implements TranslateLoader {

  getTranslation(): Observable<Record<string, string>> {
    return of({});
  }
}
