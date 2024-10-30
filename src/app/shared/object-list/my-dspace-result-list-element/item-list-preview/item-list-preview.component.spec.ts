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
import { VarDirective } from '../../../utils/var.directive';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { TruncatableService } from '../../../truncatable/truncatable.service';

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

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
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
      declarations: [ItemListPreviewComponent, TruncatePipe, VarDirective],
      providers: [
        { provide: 'objectElementProvider', useValue: { mockItemWithAuthorAndDate }},
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: TruncatableService, useValue: truncatableServiceStub },
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

  describe('When the item has an entity type and showLabel is true', () => {
    beforeEach(() => {
      component.item = mockItemWithEntityType;
      component.showLabel = true;
      fixture.detectChanges();
    });

    it('should show the badges', () => {
      const entityField = fixture.debugElement.query(By.css('ds-themed-badges'));
      expect(entityField).not.toBeNull();
    });
  });

  describe('When the item has an entity type and showLabel is false', () => {
    beforeEach(() => {
      component.item = mockItemWithEntityType;
      component.showLabel = false;
      fixture.detectChanges();
    });

    it('should not show the badges', () => {
      const entityField = fixture.debugElement.query(By.css('ds-themed-badges'));
      expect(entityField).toBeNull();
    });
  });


  describe('When truncatable section is collapsed', () => {
    beforeEach(() => {
      component.isCollapsed$ = observableOf(true);
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show limitedMetadata', () => {
      const authorElements = fixture.debugElement.queryAll(By.css('span.item-list-authors ds-metadata-link-view'));
      expect(authorElements.length).toBe(mockItemWithAuthorAndDate.limitedMetadata(component.authorMetadata, component.authorMetadataLimit).length);
    });
  });

  describe('When truncatable section is expanded', () => {
    beforeEach(() => {
      component.isCollapsed$ = observableOf(false);
      component.item = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show allMetadata', () => {
      const authorElements = fixture.debugElement.queryAll(By.css('span.item-list-authors ds-metadata-link-view'));
      expect(authorElements.length).toBe(mockItemWithAuthorAndDate.allMetadata(component.authorMetadata).length);
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
        {provide: APP_CONFIG, useValue: enviromentNoThumbs},
        { provide: TruncatableService, useValue: truncatableServiceStub },
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

  describe('When showCorrection is false', () => {
    beforeEach(() => {
      component.item = mockItemWithAuthorAndDate;
      component.showCorrection = false;
      fixture.detectChanges();
    });

    it('should not show the correction badge', () => {
      const correctionBadge = fixture.debugElement.query(By.css('ds-item-correction'));
      expect(correctionBadge).toBeFalsy();
    });
  });
});
