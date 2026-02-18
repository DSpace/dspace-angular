import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActionType } from 'src/app/core/resource-policy/models/action-type.model';

import { CommunityDataService } from '../../../../core/data/community-data.service';
import { Community } from '../../../../core/shared/community.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { VarDirective } from '../../../utils/var.directive';
import { AuthorizedCommunitySelectorComponent } from './authorized-community-selector.component';

describe('AuthorizedCommunitySelectorComponent', () => {
  let component: AuthorizedCommunitySelectorComponent;
  let fixture: ComponentFixture<AuthorizedCommunitySelectorComponent>;

  let communityService;
  let community;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    community = Object.assign(new Community(), {
      id: 'authorized-community',
    });
    communityService = jasmine.createSpyObj('communityService', {
      getAddAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
      getEditAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
      getAdminAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      declarations: [AuthorizedCommunitySelectorComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CommunityDataService, useValue: communityService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedCommunitySelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COMMUNITY];
    fixture.detectChanges();
  });

  describe('search', () => {
    describe('when action type is ADD', () => {
      it('should call getAddAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.action = ActionType.ADD;
        fixture.detectChanges();
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getAddAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
    describe('when action type is WRITE', () => {
      it('should call getEditAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.action = ActionType.WRITE;
        fixture.detectChanges();
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getEditAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
    describe('when action type is not provided', () => {
      it('should call getAdminAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getAdminAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
  });
});
