import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { MetricLoaderComponent } from './metric-loader.component';
import { MetricLoaderService } from './metric-loader.service';
import { metric1Mock } from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { MetricStyleConfigPipe } from '../pipes/metric-style-config/metric-style-config.pipe';
import SpyObj = jasmine.SpyObj;
import { CookieConsents, KlaroService } from '../../cookies/klaro.service';
import { BaseMetricComponent } from './base-metric.component';



describe('MetricLoaderComponent', () => {
  let component: MetricLoaderComponent;
  let fixture: ComponentFixture<MetricLoaderComponent>;
  let metricLoaderService: SpyObj<MetricLoaderService>;
  let klaroServiceSpy: jasmine.SpyObj<KlaroService>;


  const consentsAccepted: CookieConsents = {
    acknowledgement: true,
    authentication: true,
    preferences: true
  };


  beforeEach(waitForAsync(() => {
    (TestComponent as unknown as BaseMetricComponent).hide = new EventEmitter();
    (TestComponent as unknown as BaseMetricComponent).requestSettingsConsent = new EventEmitter();
    metricLoaderService = jasmine.createSpyObj('MetricLoaderService', {
      loadMetricTypeComponent: jasmine.createSpy('loadMetricTypeComponent')
    });
    metricLoaderService.loadMetricTypeComponent.and.returnValue(of(TestComponent).toPromise());

    klaroServiceSpy = jasmine.createSpyObj('KlaroService', {
      getSavedPreferences: jasmine.createSpy('getSavedPreferences'),
      watchConsentUpdates: jasmine.createSpy('watchConsentUpdates')
    },{
      consentsUpdates$: of(consentsAccepted)
    });

    klaroServiceSpy.getSavedPreferences.and.returnValue(of(consentsAccepted));


    TestBed.configureTestingModule({
      declarations: [ MetricLoaderComponent, MetricStyleConfigPipe ],
      providers: [
        { provide: MetricLoaderService, useValue: metricLoaderService },
        { provide: KlaroService, useValue: klaroServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricLoaderComponent);
    component = fixture.componentInstance;
    component.metric = metric1Mock;
    spyOn(component, 'loadComponent').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loadComponent).toHaveBeenCalledWith(component.metric, true);
  });

  describe('loadComponent', () => {

    beforeEach(() => {
      spyOn(component, 'instantiateComponent').and.returnValue(null);
    });

    it('should instantiate the component loaded from service', fakeAsync(() => {

      component.loadComponent(metric1Mock, true);
      tick(); // wait loadMetricT

      expect(metricLoaderService.loadMetricTypeComponent).toHaveBeenCalledWith(metric1Mock.metricType, true);
      expect(component.instantiateComponent).toHaveBeenCalledWith(TestComponent, metric1Mock, true, undefined);

    }));

  });

  describe('Script handling', () => {

    beforeEach(() => {
      klaroServiceSpy.getSavedPreferences.and.returnValue(of(consentsAccepted));
    });

    it('should instantiate the component without loading the script', fakeAsync(() => {

      component.loadComponent(metric1Mock, false);
      tick(); // wait loadMetricT

      expect(metricLoaderService.loadMetricTypeComponent).toHaveBeenCalledWith(metric1Mock.metricType, false);
      expect(((TestComponent as unknown as BaseMetricComponent).canLoadScript)).toBeFalsy();
    }));

  });


  describe('getCanLoadScript', () => {

    it('should return true for not restricted metrics', fakeAsync(() => {
        expect((component as any).getCanLoadScript(consentsAccepted)).toBeTruthy();
    }));

    it('should return false for restricted metrics', fakeAsync(() => {
      const consentRejected = {...consentsAccepted, acknowledgement: false};
      component.metric = {...metric1Mock, metricType: 'altmetric'};
      expect((component as any).getCanLoadScript(consentRejected)).toBeFalsy();
    }));

  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {
  hide = new EventEmitter();
  requestSettingsConsent = new EventEmitter();
}
