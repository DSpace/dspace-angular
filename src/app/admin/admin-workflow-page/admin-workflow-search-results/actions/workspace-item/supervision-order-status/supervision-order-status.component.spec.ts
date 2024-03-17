import {
  NO_ERRORS_SCHEMA,
  SimpleChange,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { supervisionOrderListMock } from '../../../../../../shared/testing/supervision-order.mock';
import { VarDirective } from '../../../../../../shared/utils/var.directive';
import { SupervisionOrderStatusComponent } from './supervision-order-status.component';

describe('SupervisionOrderStatusComponent', () => {
  let component: SupervisionOrderStatusComponent;
  let fixture: ComponentFixture<SupervisionOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbTooltipModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        SupervisionOrderStatusComponent, VarDirective,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionOrderStatusComponent);
    component = fixture.componentInstance;
    component.supervisionOrderList = supervisionOrderListMock;
    component.ngOnChanges(    {
      supervisionOrderList: new SimpleChange(null, supervisionOrderListMock, true),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render badges properly', () => {
    const badges = fixture.debugElement.queryAll(By.css('[data-test="soBadge"]'));
    expect(badges.length).toBe(2);
  });

  it('should emit delete event on click', () => {
    spyOn(component.delete, 'emit');
    const badges = fixture.debugElement.queryAll(By.css('[data-test="soBadge"]'));
    badges[0].nativeElement.click();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});
