import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { MetricLoaderComponent } from './metric-loader.component';
import { MetricLoaderService } from './metric-loader.service';
import { metric1Mock } from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';
import { MetricStyleConfigPipe } from '../pipes/metric-style-config/metric-style-config.pipe';
import SpyObj = jasmine.SpyObj;

describe('MetricLoaderComponent', () => {
  let component: MetricLoaderComponent;
  let fixture: ComponentFixture<MetricLoaderComponent>;
  let metricLoaderService: SpyObj<MetricLoaderService>;

  beforeEach(waitForAsync(() => {
    metricLoaderService = jasmine.createSpyObj('MetricLoaderService', {
      loadMetricTypeComponent: jasmine.createSpy('loadMetricTypeComponent')
    });
    metricLoaderService.loadMetricTypeComponent.and.returnValue(of(TestComponent).toPromise());

    TestBed.configureTestingModule({
      declarations: [ MetricLoaderComponent, MetricStyleConfigPipe ],
      providers: [
        { provide: MetricLoaderService, useValue: metricLoaderService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricLoaderComponent);
    component = fixture.componentInstance;
    spyOn(component, 'loadComponent').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loadComponent).toHaveBeenCalledWith(component.metric);
  });

  describe('loadComponent', () => {

    beforeEach(() => {
      spyOn(component, 'instantiateComponent').and.returnValue(null);
    });

    it('should instantiate the component loaded from service', fakeAsync(() => {

      component.loadComponent(metric1Mock);
      tick(); // wait loadMetricT

      expect(metricLoaderService.loadMetricTypeComponent).toHaveBeenCalledWith(metric1Mock.metricType);
      expect(component.instantiateComponent).toHaveBeenCalledWith(TestComponent, metric1Mock);

    }));

  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
