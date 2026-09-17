import { createDefaultMatomoScriptElement } from 'ngx-matomo-client';

import { MatomoService } from './matomo.service';

/**
 * Creates a custom script factory function that integrates with the `MatomoService`.
 *
 * @param matomoService - The instance of `MatomoService` used to track the loading state.
 * @returns A function to initialize script to listen onload/onerror events by MatomoService
 *
 * @example
 * // In your app config or module providers:
 * {
 * provide: MATOMO_SCRIPT_FACTORY,
 * useFactory: customMatomoScriptFactory,
 * deps: [MatomoService]
 * }
 */
export function customMatomoScriptFactory(matomoService: MatomoService) {
  return (scriptUrl: string, document: Document): HTMLScriptElement => {
    const script = createDefaultMatomoScriptElement(scriptUrl, document);

    script.onload = () => matomoService.markAsLoaded();
    script.onerror = () => matomoService.markAsError();

    return script;
  };
}
