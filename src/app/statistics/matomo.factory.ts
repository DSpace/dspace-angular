import { createDefaultMatomoScriptElement } from 'ngx-matomo-client';

import { MatomoService } from './matomo.service';

export function customMatomoScriptFactory(matomoService: MatomoService) {
  return (scriptUrl: string, document: Document): HTMLScriptElement => {
    const script = createDefaultMatomoScriptElement(scriptUrl, document);

    script.onload = () => matomoService.markAsLoaded();
    script.onerror = () => matomoService.markAsError();

    return script;
  };
}
