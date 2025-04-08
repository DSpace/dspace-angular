import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../../testing/router.stub';
import { Community } from '../../../../core/shared/community.model';
import { CreateCommunityParentSelectorComponent } from './create-community-parent-selector.component';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';

describe('CreateCommunityParentSelectorComponent', () => {
  let component: CreateCommunityParentSelectorComponent;
  let fixture: ComponentFixture<CreateCommunityParentSelectorComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Community title',
      language: undefined
    })]
  };
  const router = new RouterStub();
  const communityRD = createSuccessfulRemoteDataObject(community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const createPath = '/communities/create';
  const mockAuthorizationDataService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: observableOf(true),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CreateCommunityParentSelectorComponent],
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
            }
          },
        },
        {
          provide: Router, useValue: router
        },
        { provide: AuthorizationDataService, useValue: mockAuthorizationDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityParentSelectorComponent);
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

  it('should show the div when user is an admin', (waitForAsync(() => {
    component.isAdmin$ = observableOf(true);
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div[data-test="admin-div"]'));
    expect(divElement).toBeTruthy();
  })));

  it('should hide the div when user is not an admin', (waitForAsync(() => {
    component.isAdmin$ = observableOf(false);
    fixture.detectChanges();

    const divElement = fixture.debugElement.query(By.css('div[data-test="admin-div"]'));
    expect(divElement).toBeFalsy();
  })));

});
