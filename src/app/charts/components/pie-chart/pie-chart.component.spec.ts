import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './pie-chart.component';

xdescribe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  const view = [];
  const results = [
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
  ];
  const animations = true;
  const legend = true;
  const legendTitle = '';
  const legendPosition = 'right';
  const select: EventEmitter<string> = new EventEmitter();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NgxChartsModule
      ],
      declarations: [
        PieChartComponent
      ],
      providers: [
        { provide: 'view', useValue: view },
        { provide: 'results', useValue: results },
        { provide: 'animations', useValue: animations },
        { provide: 'legend', useValue: legend },
        { provide: 'legendTitle', useValue: legendTitle },
        { provide: 'legendPosition', userValue: legendPosition },
        { provide: 'select', useValue:  select},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
