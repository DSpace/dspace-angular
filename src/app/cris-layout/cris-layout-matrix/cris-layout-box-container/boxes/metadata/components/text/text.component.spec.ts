import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TextComponent } from './text.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { medataBoxConfigurationMock } from '../../../../../../../shared/testing/box-configurations.mock';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';

class TestItem {
  allMetadataValues(key: string): string[] {
    return ['Danilo Di Nuzzo', 'John Doe'];
  }
}

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ TextComponent, DsDatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.field = medataBoxConfigurationMock.rows[0].fields[0];
    fixture.detectChanges();
  });

  it('check metadata rendering', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
    expect(spanValueFound.length).toBe(2);
    expect(spanValueFound[0].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[0]);
    expect(spanValueFound[1].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[1]);

    const spanLabelFound = fixture.debugElement.query(By.css('div.' + medataBoxConfigurationMock.rows[0].fields[0].style));
    const label: HTMLElement = spanLabelFound.nativeElement;
    expect(label.textContent).toContain(medataBoxConfigurationMock.rows[0].fields[0].label);
    done();
  });
});
