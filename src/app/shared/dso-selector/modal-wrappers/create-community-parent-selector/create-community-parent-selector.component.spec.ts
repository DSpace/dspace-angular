import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { Community } from '../../../../core/shared/community.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { RouterStub } from '../../../testing/router.stub';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
import { CreateCommunityParentSelectorComponent } from './create-community-parent-selector.component';

describe('CreateCommunityParentSelectorComponent', () => {
  let component: CreateCommunityParentSelectorComponent;
  let fixture: ComponentFixture<CreateCommunityParentSelectorComponent>;
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
  const createPath = '/communities/create';
  const mockAuthorizationDataService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: jasmine.createSpy('isAuthorized'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CreateCommunityParentSelectorComponent],
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
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: mockAuthorizationDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CreateCommunityParentSelectorComponent, {
        remove: { imports: [DSOSelectorComponent] },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityParentSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });


  describe('when user is admin', () => {

    beforeEach(() => {
      mockAuthorizationDataService.isAuthorized.and.returnValue(of(true));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call navigate on the router with the correct edit path when navigate is called', () => {
      component.navigate(community);
      expect(router.navigate).toHaveBeenCalledWith([createPath], { queryParams: { parent: community.uuid } });
    });

    it('should show the div when user is an admin', (() => {
      const divElement = debugElement.query(By.css('div[data-test="admin-div"]'));
      expect(divElement).toBeTruthy();
    }));
  });

  describe('when user is not admin', () => {

    beforeEach(() => {
      mockAuthorizationDataService.isAuthorized.and.returnValue(of(false));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call navigate on the router with the correct edit path when navigate is called', () => {
      component.navigate(community);
      expect(router.navigate).toHaveBeenCalledWith([createPath], { queryParams: { parent: community.uuid } });
    });

    it('should hide the div when user is not an admin', (() => {
      const divElement = debugElement.query(By.css('div[data-test="admin-div"]'));
      expect(divElement).toBeFalsy();
    }));
  });

});
