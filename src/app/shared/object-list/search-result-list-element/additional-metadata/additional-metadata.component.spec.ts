import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { Item } from '../../../../core/shared/item.model';
import { VocabularyService } from '../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyServiceStub } from '../../../testing/vocabulary-service.stub';
import { AdditionalMetadataComponent } from './additional-metadata.component';

describe('AdditionalMetadataComponent', () => {
  let component: AdditionalMetadataComponent;
  let fixture: ComponentFixture<AdditionalMetadataComponent>;

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': 'test-title',
      },
      uuid: 'test-item-uuid',
      entityType: 'publication',
    },
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalMetadataComponent],
      providers: [
        { provide: VocabularyService, useValue: new VocabularyServiceStub() },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalMetadataComponent);
    component = fixture.componentInstance;
    component.object = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
