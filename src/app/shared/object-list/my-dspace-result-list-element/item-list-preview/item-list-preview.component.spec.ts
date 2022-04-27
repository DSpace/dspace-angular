import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';

import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { ItemListPreviewComponent } from './item-list-preview.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from 'src/environments/environment';

let component: ItemListPreviewComponent;
let fixture: ComponentFixture<ItemListPreviewComponent>;

const mockItemWithAuthorAndDate: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const mockItemWithoutAuthorAndDate: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ]
  }
});
const mockItemWithEntityType: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dspace.entity.type': [
      {
        language: null,
        value: 'Publication'
      }
    ]
  }
});
const mockItemWithAdditionalMeta: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dspace.description.additional': [
      {
        language: null,
        value: 'This is an additional description metadata.'
      }
    ]
  }
});

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true
  }
};

const enviromentNoThumbs = {
  browseBy: {
    showThumbnails: false
  }
};

describe('ItemListPreviewComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NoopAnimationsModule
      ],
      declarations: [ItemListPreviewComponent, TruncatePipe],
      providers: [
        { provide: 'objectElementProvider', useValue: { mockItemWithAuthorAndDate }},
        { provide: APP_CONFIG, useValue: environmentUseThumbs }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemListPreviewComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemListPreviewComponent);
    component = fixture.componentInstance;

  }));

  beforeEach(() => {
    component.object = { hitHighlights: {} } as any;
  });

  afterEach(() => {
    environment.myDSpace.additionalMetadatas = [];
  });

  describe('When showThumbnails is true', () => {
    beforeEach(() => {
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });
    it('should add the ds-thumbnail element', () => {
      const thumbnail = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnail).toBeTruthy();
    });
  });

  describe('When the item has an author', () => {
    beforeEach(() => {
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      component.item = mockItemWithoutAuthorAndDate;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      component.item = mockItemWithoutAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show the issuedate empty placeholder', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).not.toBeNull();
    });
  });

  describe('When the item has an entity type', () => {
    beforeEach(() => {
      component.item = mockItemWithEntityType;
      fixture.detectChanges();
    });

    it('should show the entity type span', () => {
      const entityField = fixture.debugElement.query(By.css('ds-type-badge'));
      expect(entityField).not.toBeNull();
    });
  });

  describe('When the config has no additional metadata', () => {
    beforeEach(() => {
      component.item = mockItemWithAdditionalMeta;
      fixture.detectChanges();
    });

    it('should not show the additional section', () => {
      const additionalSection = fixture.debugElement.query(By.css('div.item-list-additional'));
      expect(additionalSection).toBeNull();
    });
  });

  describe('When the config has one additional metadata with no match', () => {
    beforeEach(() => {
      environment.myDSpace.additionalMetadatas = [{ value: 'fake' }];
      component.item = mockItemWithAdditionalMeta;
      fixture.detectChanges();
    });

    it('should show the additional section', () => {
      const additionalSection = fixture.debugElement.query(By.css('div.item-list-additional'));
      expect(additionalSection).not.toBeNull();
    });

    it('should not show the additional metadata span', () => {
      const additionalSpan = fixture.debugElement.query(By.css('span.item-additional'));
      expect(additionalSpan).toBeNull();
    });
  });

  describe('When the config has one additional metadata with a match', () => {
    beforeEach(() => {
      environment.myDSpace.additionalMetadatas = [{ value: 'dspace.description.additional' }];
      component.item = mockItemWithAdditionalMeta;
      fixture.detectChanges();
    });

    it('should show the additional metadata span', () => {
      const additionalSpan = fixture.debugElement.query(By.css('span.item-additional'));
      expect(additionalSpan).not.toBeNull();
    });
  });
});

describe('ItemListPreviewComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NoopAnimationsModule
      ],
      declarations: [ItemListPreviewComponent, TruncatePipe],
      providers: [
        {provide: 'objectElementProvider', useValue: {mockItemWithAuthorAndDate}},
        {provide: APP_CONFIG, useValue: enviromentNoThumbs}
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemListPreviewComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));
  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemListPreviewComponent);
    component = fixture.componentInstance;

  }));

  beforeEach(() => {
    component.object = { hitHighlights: {} } as any;
  });

  describe('When showThumbnails is true', () => {
    beforeEach(() => {
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });
    it('should add the ds-thumbnail element', () => {
      const thumbnail = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnail).toBeFalsy();
    });
  });
});
