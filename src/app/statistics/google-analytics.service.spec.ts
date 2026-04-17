import {
  Angulartics2GoogleAnalytics,
  Angulartics2GoogleGlobalSiteTag,
} from 'angulartics2';
import { of } from 'rxjs';

import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { OrejimeService } from '../shared/cookies/orejime.service';
import { GOOGLE_ANALYTICS_OREJIME_KEY } from '../shared/cookies/orejime-configuration';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  const trackingIdProp = 'google.analytics.key';
  const trackingIdV4TestValue = 'G-mock-tracking-id';
  const trackingIdV3TestValue = 'UA-mock-tracking-id';
  const innerHTMLTestValue = 'mock-script-inner-html';
  const srcTestValue = 'mock-script-src';
  let service: GoogleAnalyticsService;
  let googleAnalyticsSpy: Angulartics2GoogleAnalytics;
  let googleTagManagerSpy: Angulartics2GoogleGlobalSiteTag;
  let configSpy: ConfigurationDataService;
  let orejimeServiceSpy: jasmine.SpyObj<OrejimeService>;
  let scriptElementMock: any;
  let srcSpy: any;
  let innerHTMLSpy: any;
  let bodyElementSpy: HTMLBodyElement;
  let documentSpy: Document;

  const createConfigSuccessSpy = (...values: string[]) => jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: trackingIdProp,
      values: values,
    }),
  });

  beforeEach(() => {
    googleAnalyticsSpy = jasmine.createSpyObj('Angulartics2GoogleAnalytics', [
      'startTracking',
    ]);
    googleTagManagerSpy = jasmine.createSpyObj('Angulartics2GoogleGlobalSiteTag', [
      'startTracking',
    ]);

    orejimeServiceSpy = jasmine.createSpyObj('OrejimeService', {
      'getSavedPreferences': jasmine.createSpy('getSavedPreferences'),
    });

    configSpy = createConfigSuccessSpy(trackingIdV4TestValue);

    scriptElementMock = {
      set src(newVal) { /* noop */ },
      get src() { return innerHTMLTestValue; },
      set innerHTML(newVal) { /* noop */ },
      get innerHTML() { return srcTestValue; },
    };

    innerHTMLSpy = spyOnProperty(scriptElementMock, 'innerHTML', 'set');
    srcSpy = spyOnProperty(scriptElementMock, 'src', 'set');

    bodyElementSpy = jasmine.createSpyObj('body', {
      appendChild: scriptElementMock,
    });

    documentSpy = jasmine.createSpyObj('document', {
      createElement: scriptElementMock,
    }, {
      body: bodyElementSpy,
    });

    orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
      GOOGLE_ANALYTICS_OREJIME_KEY: true,
    }));

    service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTrackingIdToPage()', () => {
    it(`should request the ${trackingIdProp} property`, () => {
      service.addTrackingIdToPage();
      expect(configSpy.findByPropertyName).toHaveBeenCalledTimes(1);
      expect(configSpy.findByPropertyName).toHaveBeenCalledWith(trackingIdProp);
    });

    describe('when the request fails', () => {
      beforeEach(() => {
        configSpy = jasmine.createSpyObj('configurationDataService', {
          findByPropertyName: createFailedRemoteDataObject$(),
        });

        orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
          GOOGLE_ANALYTICS_OREJIME_KEY: true,
        }));

        service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
      });

      it('should NOT add a script to the body', () => {
        service.addTrackingIdToPage();
        expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
      });

      it('should NOT start tracking', () => {
        service.addTrackingIdToPage();
        expect(googleAnalyticsSpy.startTracking).toHaveBeenCalledTimes(0);
        expect(googleTagManagerSpy.startTracking).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the request succeeds', () => {
      describe('when the tracking id is empty', () => {
        beforeEach(() => {
          configSpy = createConfigSuccessSpy();
          orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
            [GOOGLE_ANALYTICS_OREJIME_KEY]: true,
          }));
          service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
        });

        it('should NOT add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
        });

        it('should NOT start tracking', () => {
          service.addTrackingIdToPage();
          expect(googleAnalyticsSpy.startTracking).toHaveBeenCalledTimes(0);
          expect(googleTagManagerSpy.startTracking).toHaveBeenCalledTimes(0);
        });
      });

      describe('when google-analytics cookie preferences are not existing', () => {
        beforeEach(() => {
          configSpy = createConfigSuccessSpy(trackingIdV4TestValue);
          orejimeServiceSpy.getSavedPreferences.and.returnValue(of({}));
          service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
        });

        it('should NOT add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
        });

        it('should NOT start tracking', () => {
          service.addTrackingIdToPage();
          expect(googleAnalyticsSpy.startTracking).toHaveBeenCalledTimes(0);
          expect(googleTagManagerSpy.startTracking).toHaveBeenCalledTimes(0);
        });
      });


      describe('when google-analytics cookie preferences are set to false', () => {
        beforeEach(() => {
          configSpy = createConfigSuccessSpy(trackingIdV4TestValue);
          orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
            [GOOGLE_ANALYTICS_OREJIME_KEY]: false,
          }));
          service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
        });

        it('should NOT add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
        });

        it('should NOT start tracking', () => {
          service.addTrackingIdToPage();
          expect(googleAnalyticsSpy.startTracking).toHaveBeenCalledTimes(0);
          expect(googleTagManagerSpy.startTracking).toHaveBeenCalledTimes(0);
        });
      });

      describe('when both google-analytics cookie and the tracking v4 id are non-empty', () => {

        beforeEach(() => {
          configSpy = createConfigSuccessSpy(trackingIdV4TestValue);
          orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
            [GOOGLE_ANALYTICS_OREJIME_KEY]: true,
          }));
          service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
        });

        it('should create a script tag whose innerHTML contains the tracking id', () => {
          service.addTrackingIdToPage();
          expect(documentSpy.createElement).toHaveBeenCalledTimes(2);
          expect(documentSpy.createElement).toHaveBeenCalledWith('script');

          // sanity check
          expect(documentSpy.createElement('script')).toBe(scriptElementMock);

          expect(srcSpy).toHaveBeenCalledTimes(1);
          expect(srcSpy.calls.argsFor(0)[0]).toContain(trackingIdV4TestValue);

          expect(innerHTMLSpy).toHaveBeenCalledTimes(1);
          expect(innerHTMLSpy.calls.argsFor(0)[0]).toContain(trackingIdV4TestValue);
        });

        it('should add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(2);
        });

        it('should start tracking', () => {
          service.addTrackingIdToPage();
          expect(googleAnalyticsSpy.startTracking).not.toHaveBeenCalled();
          expect(googleTagManagerSpy.startTracking).toHaveBeenCalledTimes(1);
        });
      });

      describe('when both google-analytics cookie and the tracking id v3 are non-empty', () => {

        beforeEach(() => {
          configSpy = createConfigSuccessSpy(trackingIdV3TestValue);
          orejimeServiceSpy.getSavedPreferences.and.returnValue(of({
            [GOOGLE_ANALYTICS_OREJIME_KEY]: true,
          }));
          service = new GoogleAnalyticsService(googleAnalyticsSpy, googleTagManagerSpy, orejimeServiceSpy, configSpy, documentSpy);
        });

        it('should create a script tag whose innerHTML contains the tracking id', () => {
          service.addTrackingIdToPage();
          expect(documentSpy.createElement).toHaveBeenCalledTimes(1);
          expect(documentSpy.createElement).toHaveBeenCalledWith('script');

          // sanity check
          expect(documentSpy.createElement('script')).toBe(scriptElementMock);

          expect(innerHTMLSpy).toHaveBeenCalledTimes(1);
          expect(innerHTMLSpy.calls.argsFor(0)[0]).toContain(trackingIdV3TestValue);
        });

        it('should add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(1);
        });

        it('should start tracking', () => {
          service.addTrackingIdToPage();
          expect(googleAnalyticsSpy.startTracking).toHaveBeenCalledTimes(1);
          expect(googleTagManagerSpy.startTracking).not.toHaveBeenCalled();
        });
      });

    });

  });
});
