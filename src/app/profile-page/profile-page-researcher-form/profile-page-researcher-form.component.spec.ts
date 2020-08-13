import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { of as observableOf } from 'rxjs';

import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { ResearcherProfile } from 'src/app/core/profile/model/researcher-profile.model';
import { ResearcherProfileService } from 'src/app/core/profile/researcher-profile.service';
import { RouterStub } from 'src/app/shared/testing/router.stub';
import { VarDirective } from 'src/app/shared/utils/var.directive';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form.component';

describe('ProfilePageResearcherFormComponent', () => {

    let component: ProfilePageResearcherFormComponent;
    let fixture: ComponentFixture<ProfilePageResearcherFormComponent>;
    let router: RouterStub;

    let user: EPerson;
    let profile: ResearcherProfile;

    let researcherProfileService: ResearcherProfileService;

    function init() {
        router = new RouterStub();

        user = Object.assign(new EPerson(), {
          id: 'beef9946-f4ce-479e-8f11-b90cbe9f7241'
        });

        profile = Object.assign(new ResearcherProfile(), {
            id: 'beef9946-f4ce-479e-8f11-b90cbe9f7241',
            visible: false,
            type: 'profile'
          });

        researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
           findById: observableOf ( profile ),
           create: observableOf ( profile ),
           setVisibility: observableOf ( profile ),
           delete: observableOf ( true ),
           findRelatedItemId: observableOf ( 'a42557ca-cbb8-4442-af9c-3bb5cad2d075' )
        });

    }

    beforeEach(async(() => {
        init();
        TestBed.configureTestingModule({
          declarations: [ProfilePageResearcherFormComponent, VarDirective],
          imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
          providers: [
            { provide: ResearcherProfileService, useValue: researcherProfileService },
            {provide: Router, useValue: router}
          ],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilePageResearcherFormComponent);
        component = fixture.componentInstance;
        component.user = user;
        fixture.detectChanges();
    });

    it('should search the researcher profile for the current user', () => {
        expect(researcherProfileService.findById).toHaveBeenCalledWith(user.id);
    });

    describe('createProfile', () => {

        it('should create the profile', () => {
            component.createProfile();
            expect(researcherProfileService.create).toHaveBeenCalledWith();
        });

    });

    describe('toggleProfileVisibility', () => {

        it('should set the profile visibility to true', () => {
            profile.visible = false;
            component.toggleProfileVisibility(profile);
            expect(researcherProfileService.setVisibility).toHaveBeenCalledWith(profile, true);
        });

        it('should set the profile visibility to false', () => {
            profile.visible = true;
            component.toggleProfileVisibility(profile);
            expect(researcherProfileService.setVisibility).toHaveBeenCalledWith(profile, false);
        });

    });

    describe('deleteProfile', () => {

        it('should delete the profile', () => {
            component.deleteProfile(profile);
            expect(researcherProfileService.delete).toHaveBeenCalledWith(profile);
        });

    });

    describe('viewProfile', () => {

        it('should open the item details page', () => {
            component.viewProfile(profile);
            expect(router.navigate).toHaveBeenCalledWith(['items','a42557ca-cbb8-4442-af9c-3bb5cad2d075']);
        });

    });

});
