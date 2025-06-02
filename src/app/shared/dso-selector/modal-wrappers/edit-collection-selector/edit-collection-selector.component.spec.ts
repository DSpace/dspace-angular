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
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
import { EditCollectionSelectorComponent } from './edit-collection-selector.component';

describe('EditCollectionSelectorComponent', () => {
  let component: EditCollectionSelectorComponent;
  let fixture: ComponentFixture<EditCollectionSelectorComponent>;
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
  const editPath = '/collections/1234-1234-1234-1234/edit';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EditCollectionSelectorComponent],
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
      .overrideComponent(EditCollectionSelectorComponent, {
        remove: {
          imports: [DSOSelectorComponent],
        },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCollectionSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(collection);
    expect(router.navigate).toHaveBeenCalledWith([editPath]);
  });

});
