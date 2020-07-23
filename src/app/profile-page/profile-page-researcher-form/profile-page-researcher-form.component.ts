import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { ResearcherProfile } from 'src/app/core/profile/model/researcher-profile.model';
import { ResearcherProfileService } from 'src/app/core/profile/researcher-profile.service';


@Component({
    selector: 'ds-profile-page-researcher-form',
    templateUrl: './profile-page-researcher-form.component.html'
  })
/**
 * Component for a user to create/delete or change his researcher profile.
 */
export class ProfilePageResearcherFormComponent implements OnInit {
    
    /**
     * The user to display the form for.
     */
    @Input() 
    user: EPerson;

    /**
     * The researcher profile to show.
     */
    researcherProfile$: BehaviorSubject<ResearcherProfile> = new BehaviorSubject<ResearcherProfile>( null );

    /**
     * A boolean representing if a delete operation is pending
     * @type {BehaviorSubject<boolean>}
     */
    private processingDelete$ = new BehaviorSubject<boolean>(false);

    /**
     * A boolean representing if a create delete operation is pending
     * @type {BehaviorSubject<boolean>}
     */
    private processingCreate$ = new BehaviorSubject<boolean>(false);

    constructor( protected researcherProfileService : ResearcherProfileService,
                 protected router: Router){

    }

    ngOnInit(): void {
        this.researcherProfileService.findById(this.user.id)
            .subscribe ( researcherProfile => {
                if ( researcherProfile != null){
                    this.researcherProfile$.next(researcherProfile);
                }
            });

    }

    createProfile() : void {
        this.processingCreate$.next(true);
        this.researcherProfileService.create()
            .subscribe ( researcherProfile => {
                console.log("CREATED");
                this.researcherProfile$.next(researcherProfile);
                this.processingCreate$.next(false);
            });
    }

    viewProfile( researcherProfile : ResearcherProfile ) : void {
        this.researcherProfileService.findRelatedItemId(researcherProfile)
            .subscribe( itemId => {
                if(itemId != null){
                    this.router.navigate(["items",itemId]);
                }
            });
    }

    deleteProfile( researcherProfile : ResearcherProfile) : void {
        this.processingDelete$.next(true);
        this.researcherProfileService.deleteById(researcherProfile)
            .subscribe ( deleted => {
                console.log("DELETED:",deleted);
                if ( deleted ){
                    this.researcherProfile$.next(null);
                }
                this.processingDelete$.next(false);
            });
    }

    toggleProfileVisibility(researcherProfile : ResearcherProfile) : void {
        this.researcherProfileService.setVisibility(researcherProfile, !researcherProfile.visible)
            .subscribe ( researcherProfile => this.researcherProfile$.next(researcherProfile));
    }

    isProcessingDelete(): Observable<boolean> {
        return this.processingDelete$.asObservable();
    }

    isProcessingCreate(): Observable<boolean> {
        return this.processingCreate$.asObservable();
    }
    
}