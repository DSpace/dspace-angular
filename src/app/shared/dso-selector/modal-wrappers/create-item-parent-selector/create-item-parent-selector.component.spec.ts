import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../../core/data/remote-data';
import { RouterStub } from '../../../testing/router-stub';
import { Collection } from '../../../../core/shared/collection.model';
import { CreateItemParentSelectorComponent } from './create-item-parent-selector.component';
import { MetadataValue } from '../../../../core/shared/metadata.models';

describe('CreateItemParentSelectorComponent', () => {
  let component: CreateItemParentSelectorComponent;
  let fixture: ComponentFixture<CreateItemParentSelectorComponent>;
  let debugElement: DebugElement;

  const collection = new Collection();
  collection.uuid = '1234-1234-1234-1234';
  collection.metadata = { 'dc.title': [Object.assign(new MetadataValue(), { value: 'Collection title', language: undefined })] };
  const router = new RouterStub();
  const collectionRD = new RemoteData(false, false, true, undefined, collection);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const createPath = 'testCreatePath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CreateItemParentSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: { root: { firstChild: { firstChild: { data: observableOf({ collection: collectionRD }) } } } }
        },
        {
          provide: Router, useValue: router
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    // spyOnProperty(itemRouter, 'getItemCreatePath').and.callFake(() => {
    //   return () => createPath;
    // });

    fixture = TestBed.createComponent(CreateItemParentSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct create path when navigate is called', () => {
    /* TODO when there is a specific submission path */
    // component.navigate(item);
    // expect(router.navigate).toHaveBeenCalledWith([createPath]);
  });

});
