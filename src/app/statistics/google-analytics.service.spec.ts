import { GoogleAnalyticsService } from './google-analytics.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../shared/remote-data.utils';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';

describe('GoogleAnalyticsService', () => {
  const trackingIdProp = 'google.analytics.key';
  const trackingIdTestValue = 'mock-tracking-id';
  const innerHTMLTestValue = 'mock-script-inner-html';
  let service: GoogleAnalyticsService;
  let angularticsSpy: Angulartics2GoogleAnalytics;
  let configSpy: ConfigurationDataService;
  let scriptElementMock: any;
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
    angularticsSpy = jasmine.createSpyObj('angulartics2GoogleAnalytics', [
      'startTracking',
    ]);

    configSpy = createConfigSuccessSpy(trackingIdTestValue);

    scriptElementMock = {
      set innerHTML(newVal) { /* noop */ },
      get innerHTML() { return innerHTMLTestValue; }
    };

    innerHTMLSpy = spyOnProperty(scriptElementMock, 'innerHTML', 'set');

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
          expect(documentSpy.createElement).toHaveBeenCalledTimes(1);
          expect(documentSpy.createElement).toHaveBeenCalledWith('script');

          // sanity check
          expect(documentSpy.createElement('script')).toBe(scriptElementMock);

          expect(innerHTMLSpy).toHaveBeenCalledTimes(1);
          expect(innerHTMLSpy.calls.argsFor(0)[0]).toContain(trackingIdTestValue);
        });

        it('should add a script to the body', () => {
          service.addTrackingIdToPage();
          expect(bodyElementSpy.appendChild).toHaveBeenCalledTimes(1);
        });

        it('should start tracking', () => {
          service.addTrackingIdToPage();
          expect(angularticsSpy.startTracking).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
