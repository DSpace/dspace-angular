import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../../core/data/remote-data';
import { RouterStub } from '../../../testing/router.stub';
import * as collectionRouterPaths from '../../../../+collection-page/collection-page-routing-paths';
import { EditCollectionSelectorComponent } from './edit-collection-selector.component';
import { Collection } from '../../../../core/shared/collection.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';

describe('EditCollectionSelectorComponent', () => {
  let component: EditCollectionSelectorComponent;
  let fixture: ComponentFixture<EditCollectionSelectorComponent>;
  let debugElement: DebugElement;

  const collection = new Collection();
  collection.uuid = '1234-1234-1234-1234';
  collection.metadata = { 'dc.title': [Object.assign(new MetadataValue(), { value: 'Collection title', language: undefined })] };
  const router = new RouterStub();
  const collectionRD = createSuccessfulRemoteDataObject(collection);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const editPath = 'testEditPath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditCollectionSelectorComponent],
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
            }
          },
        },
        {
          provide: Router, useValue: router
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    spyOnProperty(collectionRouterPaths, 'getCollectionEditRoute').and.callFake(() => {
      return () => editPath;
    });

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
