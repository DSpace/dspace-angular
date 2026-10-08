import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OrejimeService } from '@dspace/core/cookies/orejime.service';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { NativeWindowService } from '@dspace/core/services/window.service';
import {
  MatomoInitializerService,
  MatomoTracker,
} from 'ngx-matomo-client';
import { firstValueFrom } from 'rxjs';

import { customMatomoScriptFactory } from './matomo.factory';
import { MatomoService } from './matomo.service';

describe('customMatomoScriptFactory', () => {
  let service: MatomoService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatomoTracker, useValue: {} },
        { provide: MatomoInitializerService, useValue: {} },
        { provide: OrejimeService, useValue: {} },
        { provide: NativeWindowService, useValue: {} },
        { provide: ConfigurationDataService, useValue: {} },
        { provide: Injector, useValue: TestBed },
      ],
    });

    service = TestBed.inject(MatomoService);
  });

  it('should notify when the script loads', async () => {
    const script = customMatomoScriptFactory(service)('', document);

    script.dispatchEvent(new Event('load'));
    const isMatomoScriptLoaded = await firstValueFrom(service.isMatomoScriptLoaded$());

    expect(isMatomoScriptLoaded).toBeTruthy();
  });

  it('should notify when the script fails', async () => {
    const script = customMatomoScriptFactory(service)('', document);

    script.dispatchEvent(new Event('error'));
    const isMatomoScriptLoaded = await firstValueFrom(service.isMatomoScriptLoaded$());

    expect(isMatomoScriptLoaded).toBeFalsy();
  });
});
