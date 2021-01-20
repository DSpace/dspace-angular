import { async, ComponentFixture, fakeAsync, TestBed, TestComponentRenderer, tick } from '@angular/core/testing';

import { MetricLoaderComponent } from './metric-loader.component';
import { MetricLoaderService } from './metric-loader.service';
import { of } from 'rxjs/internal/observable/of';
import { metric1Mock } from '../../../metrics/cris-layout-metrics-box.component.spec';
import { Component } from '@angular/core';

describe('MetricLoaderComponent', () => {
  let component: MetricLoaderComponent;
  let fixture: ComponentFixture<MetricLoaderComponent>;
  let metricLoaderService: MetricLoaderService;

  beforeEach(async(() => {
    metricLoaderService = new MetricLoaderService();
    spyOn(metricLoaderService, 'loadMetricTypeComponent').and.returnValue(of(TestComponent).toPromise());

    TestBed.configureTestingModule({
      declarations: [ MetricLoaderComponent ],
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
    })

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
