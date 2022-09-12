import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutCollectionBoxComponent } from './cris-layout-collection-box.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { Collection } from '../../../../../core/shared/collection.model';

describe('CrisLayoutCollectionBoxComponent', () => {
  let component: CrisLayoutCollectionBoxComponent;
  let fixture: ComponentFixture<CrisLayoutCollectionBoxComponent>;

  const testBox = Object.assign(new CrisLayoutBox(), {
    'id': 1,
    'shortname': 'collections',
    'header': 'Collections',
    'entityType': 'Publication',
    'collapsed': false,
    'minor': false,
    'style': null,
    'security': 0,
    'boxType': 'COLLECTIONS',
    'maxColumns': null,
    'configuration': null,
    'metadataSecurityFields': [],
    'container': false
  });

  const owningCollection = Object.assign(new Collection(), {uuid: 'test-collection-uuid'});

  const owningCollection$ = createSuccessfulRemoteDataObject$<Collection>(owningCollection);

  const testItem = Object.assign(new Item(), {
    type: 'item',
    owningCollection: owningCollection$,
    uuid: 'test-item-uuid',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [CrisLayoutCollectionBoxComponent],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutCollectionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
