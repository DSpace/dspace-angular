import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Item } from '../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { ItemPageFieldComponent } from './item-page-field.component';
import { MetadataValuesComponent } from '../../../field-components/metadata-values/metadata-values.component';
import { MetadataMap, MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { environment } from '../../../../../environments/environment';
import { MarkdownPipe } from '../../../../shared/utils/markdown.pipe';
import { SharedModule } from '../../../../shared/shared.module';
import { APP_CONFIG } from '../../../../../config/app-config.interface';

let comp: ItemPageFieldComponent;
let fixture: ComponentFixture<ItemPageFieldComponent>;
let markdownSpy;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockFields = [mockField];

describe('ItemPageFieldComponent', () => {

  let appConfig = Object.assign({}, environment, {
    markdown: {
      enabled: false,
      mathjax: false,
    }
  });

  const buildTestEnvironment = async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        SharedModule,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: appConfig },
      ],
      declarations: [ItemPageFieldComponent, MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
    markdownSpy = spyOn(MarkdownPipe.prototype, 'transform');
    fixture = TestBed.createComponent(ItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldAndValue(mockField, mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  };

  it('should display display the correct metadata value', waitForAsync(async () => {
    await buildTestEnvironment();
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  }));

  describe('when markdown is disabled in the environment config', () => {

    beforeEach(waitForAsync(async () => {
      appConfig.markdown.enabled = false;
      await buildTestEnvironment();
    }));

    describe('and markdown is disabled in this component', () => {

      beforeEach(() => {
        comp.enableMarkdown = false;
        fixture.detectChanges();
      });

      it('should not use the Markdown Pipe', () => {
        expect(markdownSpy).not.toHaveBeenCalled();
      });
    });

    describe('and markdown is enabled in this component', () => {

      beforeEach(() => {
        comp.enableMarkdown = true;
        fixture.detectChanges();
      });

      it('should not use the Markdown Pipe', () => {
        expect(markdownSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('when markdown is enabled in the environment config', () => {

    beforeEach(waitForAsync(async () => {
      appConfig.markdown.enabled = true;
      await buildTestEnvironment();
    }));

    describe('and markdown is disabled in this component', () => {

      beforeEach(() => {
        comp.enableMarkdown = false;
        fixture.detectChanges();
      });

      it('should not use the Markdown Pipe', () => {
        expect(markdownSpy).not.toHaveBeenCalled();
      });
    });

    describe('and markdown is enabled in this component', () => {

      beforeEach(() => {
        comp.enableMarkdown = true;
        fixture.detectChanges();
      });

      it('should use the Markdown Pipe', () => {
        expect(markdownSpy).toHaveBeenCalled();
      });
    });
  });
});

export function mockItemWithMetadataFieldAndValue(field: string, value: string): Item {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap()
  });
  item.metadata[field] = [{
    language: 'en_US',
    value: value
  }] as MetadataValue[];
  return item;
}
