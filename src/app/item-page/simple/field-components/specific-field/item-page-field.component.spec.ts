import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BrowseService } from '@dspace/core/browse/browse.service';
import { Item } from '@dspace/core/shared/item.model';
import { MathService } from '@dspace/core/shared/math.service';
import {
  MetadataMap,
  MetadataValue,
} from '@dspace/core/shared/metadata.models';
import { BrowseServiceStub } from '@dspace/core/testing/browse-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import { MarkdownDirective } from '../../../../shared/utils/markdown.directive';
import { MetadataValuesComponent } from '../../../field-components/metadata-values/metadata-values.component';
import { ItemPageFieldComponent } from './item-page-field.component';

let comp: TestItemPageFieldComponent;
let fixture: ComponentFixture<TestItemPageFieldComponent>;
let markdownSpy;

const mockValue = 'test value';
const mockField = 'dc.test';
const mockLabel = 'test label';
const mockAuthorField = 'dc.contributor.author';
const mockDateIssuedField = 'dc.date.issued';
const mockFields = [mockField, mockAuthorField, mockDateIssuedField];

@Component({
  selector: 'ds-test-item-page-field',
  templateUrl: './item-page-field.component.html',
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
class TestItemPageFieldComponent extends ItemPageFieldComponent {
}

describe('ItemPageFieldComponent', () => {

  let appConfig = Object.assign({}, environment, {
    markdown: {
      enabled: false,
      mathjax: false,
    },
  });

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        MetadataValuesComponent,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: appConfig },
        { provide: BrowseService, useValue: BrowseServiceStub },
        { provide: MathService, useValue: {} },
      ],
    }).compileComponents();
    markdownSpy = spyOn(MarkdownDirective.prototype, 'render');
    fixture = TestBed.createComponent(TestItemPageFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue(mockFields, mockValue);
    comp.fields = mockFields;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });

  describe('when markdown is disabled in the environment config', () => {
    beforeEach( () => {
      appConfig.markdown.enabled = false;
    });

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
    beforeEach(() => {
      appConfig.markdown.enabled = true;
    });

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

  describe('test rendering of configured browse links', () => {
    beforeEach(() => {
      appConfig.markdown.enabled = false;
      comp.enableMarkdown = true;
      fixture.detectChanges();
    });

    it('should have a browse link', async () => {
      expect(fixture.debugElement.query(By.css('a.ds-browse-link')).nativeElement.innerHTML).toContain(mockValue);
    });
  });

  describe('test rendering of configured regex-based links', () => {
    beforeEach(() => {
      comp.urlRegex = '^test';
      fixture.detectChanges();
    });

    it('should have a rendered (non-browse) link since the value matches ^test', () => {
      expect(fixture.debugElement.query(By.css('a.ds-simple-metadata-link')).nativeElement.innerHTML).toContain(mockValue);
    });
  });

  describe('test skipping of configured links that do NOT match regex', () => {
    beforeEach(() => {
      comp.urlRegex = '^nope';
      fixture.detectChanges();
    });

    it('should NOT have a rendered (non-browse) link since the value matches ^test', () => {
      expect(fixture.debugElement.query(By.css('a.ds-simple-metadata-link'))).toBeNull();
    });
  });
});

export function mockItemWithMetadataFieldsAndValue(fields: string[], value: string): Item {
  const item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: new MetadataMap(),
  });
  fields.forEach((field: string) => {
    item.metadata[field] = [{
      language: 'en_US',
      value: value,
    }] as MetadataValue[];
  });
  return item;
}
