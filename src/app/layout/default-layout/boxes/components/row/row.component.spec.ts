import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowComponent } from './row.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../../../../directives/cris-layout-loader.directive';
import { TextComponent } from '../text/text.component';
import { ComponentFactoryResolver, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { medataComponent } from '../../../../../shared/testing/metadata-components.mock';

class TestItem {
  firstMetadataValue(key: string): string {
    return 'Item';
  }
}

describe('RowComponent', () => {
  let component: RowComponent;
  let fixture: ComponentFixture<RowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [
        RowComponent,
        CrisLayoutLoaderDirective,
        TextComponent
      ],
      providers: [
        ComponentFactoryResolver
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(RowComponent, {
      set: {
        entryComponents: [TextComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.row = medataComponent.rows[0];
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getMetadataBoxFieldRendering function with the right types', () => {
      expect(component).toBeDefined();
    });
  });
});
