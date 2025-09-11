import { TestBed } from '@angular/core/testing';
import {
  ItemDataService,
  VocabularyService,
  ItemDataServiceStub,
  VocabularyServiceStub,
} from '@dspace/core'

import { DsoEditMetadataFieldService } from './dso-edit-metadata-field.service';

describe('DsoEditMetadataFieldService', () => {
  let service: DsoEditMetadataFieldService;

  let itemService: ItemDataServiceStub;
  let vocabularyService: VocabularyServiceStub;

  beforeEach(() => {
    itemService = new ItemDataServiceStub();
    vocabularyService = new VocabularyServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: VocabularyService, useValue: vocabularyService },
      ],
    });
    service = TestBed.inject(DsoEditMetadataFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
