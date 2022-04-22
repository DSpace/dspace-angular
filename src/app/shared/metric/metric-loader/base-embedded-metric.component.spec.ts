import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Component } from '@angular/core';
import { BaseEmbeddedMetricComponent } from './base-embedded-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { metricAltmetricMock } from '../../../cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metrics/cris-layout-metrics-box.component.spec';

describe('BaseEmbeddedMetricComponent', () => {
  let component: TestEmbeddedMetricComponent;
  let fixture: ComponentFixture<TestEmbeddedMetricComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ TestEmbeddedMetricComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEmbeddedMetricComponent);
    component = fixture.componentInstance;
    component.metric = metricAltmetricMock;
    component.timeout = 0;
    component.maxRetry = 2;
    fixture.detectChanges();

    spyOn(component, 'applyScriptHandler').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initScript on ngAfterViewInit', fakeAsync(() => {
    spyOn(component, 'initScript').and.returnValue(null);
    component.ngAfterViewInit();

    expect(component.initScript).toHaveBeenCalled();
  }));

  it('init script should retry in case of error after a given timeout', fakeAsync(() => {

    component.timeout = 5;
    component.maxRetry = 2;

    // first attempt (error)
    spyOn(component, 'applyScript').and.throwError('my-error');
    component.initScript();
    tick(5);

    expect(component.applyScriptHandler).toHaveBeenCalledTimes(1);
    expect(component.success).toBe(false);

    // second attempt (success)
    component.applyScript = jasmine.createSpy().and.returnValue('ok');

    tick(5);

    expect(component.success).toBe(true);
    expect(component.applyScriptHandler).toHaveBeenCalledTimes(2);
  }));

  it('init script should retry for a max number of times', fakeAsync(() => {

    component.timeout = 0;
    component.maxRetry = 2;

    // first attempt (error)
    spyOn(component, 'applyScript').and.throwError('my-error');
    component.initScript();
    tick();

    expect(component.applyScriptHandler).toHaveBeenCalledTimes(2);
    expect(component.success).toBe(false);

  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestEmbeddedMetricComponent extends BaseEmbeddedMetricComponent {

  constructor(protected sr: DomSanitizer) {
    super(sr);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  applyScript() {}
}
