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

import { Community } from '../../../../../../modules/core/src/lib/core/shared/community.model';
import { MetadataValue } from '../../../../../../modules/core/src/lib/core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { RouterStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/router.stub';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
import { EditCommunitySelectorComponent } from './edit-community-selector.component';

describe('EditCommunitySelectorComponent', () => {
  let component: EditCommunitySelectorComponent;
  let fixture: ComponentFixture<EditCommunitySelectorComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Community title',
      language: undefined,
    })],
  };
  const router = new RouterStub();
  const communityRD = createSuccessfulRemoteDataObject(community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const editPath = '/communities/1234-1234-1234-1234/edit';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EditCommunitySelectorComponent],
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
      .overrideComponent(EditCommunitySelectorComponent, {
        remove: {
          imports: [DSOSelectorComponent],
        },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommunitySelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(community);
    expect(router.navigate).toHaveBeenCalledWith([editPath]);
  });

});
