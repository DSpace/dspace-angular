import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { MetadataValuesComponent } from './metadata-values.component';

let comp: MetadataValuesComponent;
let fixture: ComponentFixture<MetadataValuesComponent>;

const mockMetadata = [
  { language: 'en_US', value: '1234' },
  { language: 'en_US', value: 'a publisher' },
  { language: 'en_US', value: 'desc' },
] as MetadataValue[];
const mockSeperator = '<br/>';
const mockLabel = 'fake.message';
const vocabularyServiceMock = {
  getPublicVocabularyEntryByID: jasmine.createSpy('getPublicVocabularyEntryByID'),
};

const controlledMetadata = {
  value: 'Original Value',
  authority: 'srsc:1234',
  uuid: 'metadata-uuid-1',
  language: 'en_US',
  place: null,
  confidence: 600,
} as MetadataValue;

describe('MetadataValuesComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        MetadataValuesComponent,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: VocabularyService, useValue: vocabularyServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({}),
            data: of({}),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MetadataValuesComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetadataValuesComponent);
    comp = fixture.componentInstance;
    comp.mdValues = mockMetadata;
    comp.separator = mockSeperator;
    comp.label = mockLabel;
    comp.urlRegex = /^.*test.*$/;
    fixture.detectChanges();
  }));

  it('should display all metadata values', () => {
    const innerHTML = fixture.nativeElement.innerHTML;
    for (const metadatum of mockMetadata) {
      expect(innerHTML).toContain(metadatum.value);
    }
  });

  it('should contain separators equal to the amount of metadata values minus one', () => {
    const separators = fixture.debugElement.queryAll(By.css('span.separator'));
    expect(separators.length).toBe(mockMetadata.length - 1);
  });

  it('should correctly detect a pattern on string containing "test"', () => {
    const mdValue = { value: 'This is a test value' } as MetadataValue;
    expect(comp.hasLink(mdValue)).toBe(true);
  });

  it('should return correct target and rel for internal links', () => {
    spyOn(comp, 'hasInternalLink').and.returnValue(true);
    const result = comp.getLinkAttributes('/internal-link');
    expect(result.target).toBe('_self');
    expect(result.rel).toBe('');
  });

  it('should return correct target and rel for external links', () => {
    spyOn(comp, 'hasInternalLink').and.returnValue(false);
    const result = comp.getLinkAttributes('https://www.dspace.org');
    expect(result.target).toBe('_blank');
    expect(result.rel).toBe('noopener noreferrer');
  });

  it('should detect controlled vocabulary metadata', () => {
    expect(comp.isControlledVocabulary(controlledMetadata)).toBeTrue();
  });

  it('should return translated vocabulary value when available', (done) => {
    vocabularyServiceMock.getPublicVocabularyEntryByID.and.returnValue(
      of(createSuccessfulRemoteDataObject(
        buildPaginatedList(new PageInfo(), [{ display: 'Translated Value' }]),
      )),
    );
    comp.getVocabularyValue(controlledMetadata).subscribe((value) => {
      expect(value).toBe('Translated Value');
      done();
    });
  });

  it('should render search link when searchFilter is present', () => {
    comp.searchFilter = 'subject';
    expect(comp.hasSearchFilter()).toBeTrue();
    expect(comp.getSearchQueryParams('test')).toEqual({ 'f.subject': 'test,equals' });
  });

  it('should render browse link when browseDefinition is provided', () => {
    comp.browseDefinition = {
      id: 'subject',
      metadataKeys: [],
      order: 0,
      getRenderType: () => 'metadata',
    } as any;
    expect(comp.hasBrowseDefinition()).toBeTrue();
  });

});
