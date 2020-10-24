import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateComponent } from './date.component';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DsDatePipe } from 'src/app/layout/pipes/ds-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { LayoutField } from 'src/app/core/layout/models/metadata-component.model';

describe('DateComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'person.birthDate': [
        {
          value: '2020-08-24'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'person.birthDate'
  }) as LayoutField;

  const translateServiceInstace = Object.assign({
    get: (key: string) => {
      return of('LOCALIZED_MONTH');
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ DateComponent, DsDatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the localized date', () => {
    const valueContainer = fixture.debugElement.query(By.css('span.txt-value'));
    expect(valueContainer.nativeElement.textContent.trim()).toBeTruthy();
  });
});
