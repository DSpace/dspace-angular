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
import { Community } from '@dspace/core/shared/community.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizedCommunitySelectorComponent } from '../../dso-selector/authorized-community-selector/authorized-community-selector.component';
import { CreateCollectionParentSelectorComponent } from './create-collection-parent-selector.component';

describe('CreateCollectionParentSelectorComponent', () => {
  let component: CreateCollectionParentSelectorComponent;
  let fixture: ComponentFixture<CreateCollectionParentSelectorComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = {
    'dc.title': [
      Object.assign(new MetadataValue(), {
        value: 'Community title',
        language: undefined,
      })],
  };
  const router = new RouterStub();
  const communityRD = createSuccessfulRemoteDataObject(community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const createPath = '/collections/create';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CreateCollectionParentSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: communityRD,
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
      .overrideComponent(CreateCollectionParentSelectorComponent, {
        remove: { imports: [AuthorizedCommunitySelectorComponent] },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionParentSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(community);
    expect(router.navigate).toHaveBeenCalledWith([createPath], { queryParams: { parent: community.uuid } });
  });

});
