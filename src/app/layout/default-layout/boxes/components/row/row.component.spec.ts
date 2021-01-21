import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowComponent } from './row.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrisLayoutLoaderDirective } from '../../../../directives/cris-layout-loader.directive';
import { TextComponent } from '../text/text.component';
import { NO_ERRORS_SCHEMA, ComponentFactoryResolver } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { medataComponent } from '../../../../../shared/testing/metadata-components.mock';
import * as BoxDecorators from '../metadata-box.decorator';
import { spyOnExported } from '../../../../../shared/testing/utils.test';

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
    spyOnExported(BoxDecorators, 'getMetadataBoxFieldRendering').and.returnValue(TextComponent);
    fixture.detectChanges();
  });

  describe('When the component is rendered', () => {
    it('should call the getMetadataBoxFieldRendering function with the right types', () => {
      component.getComponent('text');
      expect(BoxDecorators.getMetadataBoxFieldRendering).toHaveBeenCalledWith('text');
    });
  });
});
