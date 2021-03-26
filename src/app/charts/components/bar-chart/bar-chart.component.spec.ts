import { EventEmitter, Injector } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ChartType } from '../../models/chart-type';
import { BarChartComponent } from './bar-chart.component';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';

xdescribe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  const view = [];
  const results = observableOf([
    {
      name: 'Germany',
      value: 8940000
    },
    {
      name: 'USA',
      value: 5000000
    },
    {
      name: 'France',
      value: 7200000
    }
  ]);
  const animations = true;
  const legend = true;
  const legendTitle = '';
  const legendPosition = 'right';
  const select: EventEmitter<string> = new EventEmitter();
  const loadMore: EventEmitter<string> = new EventEmitter();
  const enableScrollToLeft = false;
  const enableScrollToRight = false;
  const isLastPage = observableOf(false);
  const currentPage = observableOf(1);
  const type = ChartType.BAR;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NgxChartsModule
      ],
      declarations: [
        AbstractChartComponent,
        BarChartComponent
      ],
      providers: [
        { provide: 'view', useValue: view },
        { provide: 'results', useValue: results },
        { provide: 'animations', useValue: animations },
        { provide: 'legend', useValue: legend },
        { provide: 'legendTitle', useValue: legendTitle },
        { provide: 'legendPosition', userValue: legendPosition },
        { provide: 'select', useValue: select },
        { provide: 'enableScrollToLeft', useValue: enableScrollToLeft },
        { provide: 'enableScrollToRight', useValue: enableScrollToRight },
        { provide: 'loadMore', useValue: loadMore },
        { provide: 'isLastPage', useValue: isLastPage },
        { provide: 'currentPage', useValue: currentPage },
        { provide: 'type', useValue: type },
        Injector
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

/*  describe('when the setViewSize method is called', () => {
    beforeEach(() => {
      spyOn(component, 'setViewSize');
      component.setViewSize();
    });

    it('should call the setViewSize method', () => {
      expect(component.setViewSize).toHaveBeenCalled();
    });
  });*/

});
