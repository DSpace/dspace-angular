import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { VocabularyService } from '../../../../core/submission/vocabularies/vocabulary.service';
import { MetadataLinkViewComponent } from '../../../metadata-link-view/metadata-link-view.component';
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
        { provide: APP_CONFIG, useValue: environment },
      ],
    })
      .overrideComponent(AdditionalMetadataComponent, { remove: { imports: [MetadataLinkViewComponent] } }).compileComponents();
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

  it('should keep white space in metadata value if shouldKeepWhiteSpaces is true', () => {
    expect(component.composeLink('keep my white spaces', 'keepMyWhiteSpaces')).toEqual({
      href: 'https://keepmywhitespaces.com/keep my white spaces',
      text: 'keep my white spaces',
    });
  });

  it('should not keep white space in metadata value if shouldKeepWhiteSpaces is false', () => {
    expect(component.composeLink('do not keep my white spaces', 'doi')).toEqual({
      href: 'https://doi.org/donotkeepmywhitespaces',
      text: 'do not keep my white spaces',
    });
  });
});
