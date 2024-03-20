import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Collection } from '../../../../core/shared/collection.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { RouterStub } from '../../../testing/router.stub';
import { AuthorizedCollectionSelectorComponent } from '../../dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { CreateItemParentSelectorComponent } from './create-item-parent-selector.component';

describe('CreateItemParentSelectorComponent', () => {
  let component: CreateItemParentSelectorComponent;
  let fixture: ComponentFixture<CreateItemParentSelectorComponent>;
  let debugElement: DebugElement;

  const collection = new Collection();
  collection.uuid = '1234-1234-1234-1234';
  collection.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Collection title',
      language: undefined,
    })],
  };
  const router = new RouterStub();
  const collectionRD = createSuccessfulRemoteDataObject(collection);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CreateItemParentSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: collectionRD,
                },
              },
            },
          },
        },
        {
          provide: Router, useValue: router,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CreateItemParentSelectorComponent, {
        remove: { imports: [AuthorizedCollectionSelectorComponent] },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemParentSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct create path when navigate is called', () => {
    component.navigate(collection);
    expect(router.navigate).toHaveBeenCalledWith(['/submit'], { queryParams: { collection: collection.uuid } });
  });

  it('should call navigate on the router with entityType parameter', () => {
    const entityType = 'Person';
    component.entityType = entityType;
    component.navigate(collection);
    expect(router.navigate).toHaveBeenCalledWith(['/submit'], { queryParams: { collection: collection.uuid, entityType: entityType } });
  });
});
