import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingComponent } from './heading.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Item } from '../../../../../core/shared/item.model';
import { medataComponent } from '../../../../../shared/testing/metadata-components.mock';
import { By } from '@angular/platform-browser';

class TestItem {
  allMetadataValues(key: string): string[] {
    return ['This is the title'];
  }
}

describe('HeadingComponent', () => {
  let component: HeadingComponent;
  let fixture: ComponentFixture<HeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ HeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadingComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.field = medataComponent.rows[0].fields[0];
    fixture.detectChanges();
  });

  it('check heading rendering', () => {
    const divFound = fixture.debugElement.queryAll(By.css('div.h2'));
    expect(divFound.length).toBe(1);
    expect(divFound[0].nativeElement.textContent).toContain((new TestItem()).allMetadataValues('')[0]);
  });
});
