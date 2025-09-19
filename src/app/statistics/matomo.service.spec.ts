import {
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  MatomoInitializerService,
  MatomoTracker,
} from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { OrejimeService } from '../shared/cookies/orejime.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import {
  MATOMO_ENABLED,
  MATOMO_SITE_ID,
  MATOMO_TRACKER_URL,
  MatomoService,
} from './matomo.service';

describe('MatomoService', () => {
  let service: MatomoService;
  let matomoTracker: jasmine.SpyObj<MatomoTracker>;
  let matomoInitializer: jasmine.SpyObj<MatomoInitializerService>;
  let orejimeService: jasmine.SpyObj<OrejimeService>;
  let nativeWindowService: jasmine.SpyObj<NativeWindowRef>;
  let configService: jasmine.SpyObj<ConfigurationDataService>;

  beforeEach(() => {
    matomoTracker = jasmine.createSpyObj('MatomoTracker', ['setConsentGiven', 'forgetConsentGiven', 'getVisitorId']);
    matomoInitializer = jasmine.createSpyObj('MatomoInitializerService', ['initializeTracker']);
    orejimeService = jasmine.createSpyObj('OrejimeService', ['getSavedPreferences']);
    nativeWindowService = jasmine.createSpyObj('NativeWindowService', [], { nativeWindow: {} });
    configService = jasmine.createSpyObj('ConfigurationDataService', ['findByPropertyName']);
    configService.findByPropertyName.and.returnValue(createFailedRemoteDataObject$());

    TestBed.configureTestingModule({
      imports: [MatomoTestingModule.forRoot()],
      providers: [
        { provide: MatomoTracker, useValue: matomoTracker },
        { provide: MatomoInitializerService, useValue: matomoInitializer },
        { provide: OrejimeService, useValue: orejimeService },
        { provide: NativeWindowService, useValue: nativeWindowService },
        { provide: ConfigurationDataService, useValue: configService },
        { provide: Injector, useValue: TestBed },
      ],
    });

    service = TestBed.inject(MatomoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set changeMatomoConsent on native window', () => {
    orejimeService.getSavedPreferences.and.returnValue(of({ matomo: true }));
    service.init();
    expect(nativeWindowService.nativeWindow.changeMatomoConsent).toBe(service.changeMatomoConsent);
  });

  it('should call setConsentGiven when consent is true', () => {
    service.matomoTracker = matomoTracker;
    service.changeMatomoConsent(true);
    expect(matomoTracker.setConsentGiven).toHaveBeenCalled();
  });

  it('should call forgetConsentGiven when consent is false', () => {
    service.matomoTracker = matomoTracker;
    service.changeMatomoConsent(false);
    expect(matomoTracker.forgetConsentGiven).toHaveBeenCalled();
  });

  it('should initialize tracker with values from angular configuration', () => {
    environment.production = true;
    environment.matomo = { trackerUrl: 'http://localhost:80801' };
    configService.findByPropertyName.withArgs(MATOMO_TRACKER_URL).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['http://matomo'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_ENABLED).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['true'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_SITE_ID).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), { values: ['1'] })));
    orejimeService.getSavedPreferences.and.returnValue(of({ matomo: true }));

    runInInjectionContext(TestBed, () => {
      service.init();
    });

    expect(matomoTracker.setConsentGiven).toHaveBeenCalled();
    expect(matomoInitializer.initializeTracker).toHaveBeenCalledWith({
      siteId: '1',
      trackerUrl: 'http://localhost:80801',
    });
  });

  it('should initialize tracker with REST configuration correct parameters in production', fakeAsync(() => {
    environment.production = true;
    environment.matomo = { trackerUrl: '' };
    configService.findByPropertyName.withArgs(MATOMO_TRACKER_URL).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['http://example.com'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_ENABLED).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['true'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_SITE_ID).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), { values: ['1'] })));
    orejimeService.getSavedPreferences.and.returnValue(of({ matomo: true }));

    runInInjectionContext(TestBed, () => {
      service.init();
    });

    tick();

    expect(matomoTracker.setConsentGiven).toHaveBeenCalled();
    expect(matomoInitializer.initializeTracker).toHaveBeenCalledWith({
      siteId: '1',
      trackerUrl: 'http://example.com',
    });
  }));

  it('should not initialize tracker if not in production', () => {
    environment.production = false;

    runInInjectionContext(TestBed, () => {
      service.init();
    });

    expect(matomoInitializer.initializeTracker).not.toHaveBeenCalled();
  });

  it('should not initialize tracker if matomo is disabled', () => {
    environment.production = true;
    environment.matomo = { trackerUrl: '' };
    configService.findByPropertyName.withArgs(MATOMO_TRACKER_URL).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['http://example.com'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_ENABLED).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(),{ values: ['false'] })),
    );
    configService.findByPropertyName.withArgs(MATOMO_SITE_ID).and.returnValue(
      createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), { values: ['1'] })));
    orejimeService.getSavedPreferences.and.returnValue(of({ matomo: true }));

    runInInjectionContext(TestBed, () => {
      service.init();
    });

    expect(matomoInitializer.initializeTracker).not.toHaveBeenCalled();
  });

  describe('with visitorId set', () => {
    beforeEach(() => {
      matomoTracker.getVisitorId.and.returnValue(Promise.resolve('12345'));
      service.matomoTracker = matomoTracker;
    });

    it('should add trackerId parameter', fakeAsync(() => {
      service.appendVisitorId('http://example.com/')
        .subscribe(url => expect(url).toEqual('http://example.com/?trackerId=12345'));
      tick();
    }));

  });

});
