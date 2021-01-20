import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CollectionSelectorComponent } from './collection-selector.component';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';

const community: Community = Object.assign(new Community(), {
  id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  name: 'Community 1'
});

const collection: Collection = Object.assign(new Collection(), {
  id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  name: 'Collection 1',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 1-Collection 1'
    }],
  parentCommunity: createSuccessfulRemoteDataObject$(community)
});

describe('CollectionSelectorComponent', () => {
  let component: CollectionSelectorComponent;
  let fixture: ComponentFixture<CollectionSelectorComponent>;
  const modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [CollectionSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modal }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with selected dso', () => {
    component.selectObject(collection);
    expect((component as any).activeModal.close).toHaveBeenCalledWith(collection);
  });

  it('should close the dialog', () => {
    component.close();
    expect((component as any).activeModal.close).toHaveBeenCalled();
  });
});
