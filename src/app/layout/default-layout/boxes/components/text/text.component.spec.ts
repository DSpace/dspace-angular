import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextComponent } from './text.component';
import { Item } from 'src/app/core/shared/item.model';
import { medataComponent } from 'src/app/shared/testing/metadata-components.mock';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class TestItem {
  firstMetadataValue(key: string): string {
    return 'Danilo Di Nuzzo';
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
      declarations: [ TextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.field = medataComponent.rows[0].fields[0];
    fixture.detectChanges();
  });

  it('check metadata rendering', () => {
    const spanValueFound = fixture.debugElement.query(By.css('span.txt-value'));
    const span: HTMLElement = spanValueFound.nativeElement;
    expect(span.textContent).toContain((new TestItem()).firstMetadataValue(''));

    const spanLabelFound = fixture.debugElement.query(By.css('span.font-weight-bold'));
    const label: HTMLElement = spanLabelFound.nativeElement;
    expect(label.textContent).toContain(medataComponent.rows[0].fields[0].label);
  });
});
