import { GoogleAnalyticsService } from './google-analytics.service';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';

describe('GoogleAnalyticsService', () => {
  const trackingIdProp = 'google.analytics.key';
  const trackingIdTestValue = 'mock-tracking-id';
  const innerHTMLTestValue = 'mock-script-inner-html';
  const srcTestValue = 'mock-script-src';
  let service: GoogleAnalyticsService;
  let angularticsSpy: Angulartics2GoogleTagManager;
  let configSpy: ConfigurationDataService;
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
    angularticsSpy = jasmine.createSpyObj('Angulartics2GoogleTagManager', [
      'startTracking',
    ]);

    configSpy = createConfigSuccessSpy(trackingIdTestValue);

    scriptElementMock = {
      set src(newVal) { /* noop */ },
      get src() { return innerHTMLTestValue; },
      set innerHTML(newVal) { /* noop */ },
      get innerHTML() { return srcTestValue; }
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

    service = new GoogleAnalyticsService(angularticsSpy, configSpy, documentSpy);
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

        service = new GoogleAnalyticsService(angularticsSpy, configSpy, documentSpy);
      });

      it('should NOT add a script to the body', () => {
        service.addTrackingIdToPage();
        expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
      });

      it('should NOT start tracking', () => {
        service.addTrackingIdToPage();
        expect(angularticsSpy.startTracking).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the request succeeds', () => {
      describe('when the tracking id is empty', () => {
        beforeEach(() => {
          configSpy = createConfigSuccessSpy();
          service = new GoogleAnalyticsService(angularticsSpy, configSpy, documentSpy);
        });

        it('should NOT add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(0);
        });

        it('should NOT start tracking', () => {
          service.addTrackingIdToPage();
          expect(angularticsSpy.startTracking).toHaveBeenCalledTimes(0);
        });
      });

      describe('when the tracking id is non-empty', () => {
        it('should create a script tag whose innerHTML contains the tracking id', () => {
          service.addTrackingIdToPage();
          expect(documentSpy.createElement).toHaveBeenCalledTimes(2);
          expect(documentSpy.createElement).toHaveBeenCalledWith('script');

          // sanity check
          expect(documentSpy.createElement('script')).toBe(scriptElementMock);

          expect(srcSpy).toHaveBeenCalledTimes(1);
          expect(srcSpy.calls.argsFor(0)[0]).toContain(trackingIdTestValue);

          expect(innerHTMLSpy).toHaveBeenCalledTimes(1);
          expect(innerHTMLSpy.calls.argsFor(0)[0]).toContain(trackingIdTestValue);
        });

        it('should add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(2);
        });

        it('should start tracking', () => {
          service.addTrackingIdToPage();
          expect(angularticsSpy.startTracking).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
