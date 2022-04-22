import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { ClaimItemSelectorComponent } from '../../shared/dso-selector/modal-wrappers/claim-item-selector/claim-item-selector.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { AuthService } from '../../core/auth/auth.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { ProfileClaimService } from '../profile-claim/profile-claim.service';
import { isNotEmpty } from '../../shared/empty.util';

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
  @Input() user: EPerson;

  /**
   * The researcher profile to show.
   */
  researcherProfile$: BehaviorSubject<ResearcherProfile> = new BehaviorSubject<ResearcherProfile>(null);

  /**
   * A boolean representing if a delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  processingDelete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if a create delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  processingCreate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * If exists The uuid of the item associated to the researcher profile
   */
  researcherProfileItemId: string;

  constructor(protected researcherProfileService: ResearcherProfileService,
              protected profileClaimService: ProfileClaimService,
              protected translationService: TranslateService,
              protected notificationService: NotificationsService,
              protected authService: AuthService,
              protected router: Router,
              protected modalService: NgbModal) {

  }

  /**
   * Initialize the component searching the current user researcher profile.
   */
  ngOnInit(): void {
    // Retrieve researcherProfile if exists
    this.initResearchProfile();
  }

  /**
   * Create a new profile for the current user.
   */
  createProfile(): void {
    this.processingCreate$.next(true);

    this.authService.getAuthenticatedUserFromStore().pipe(
      switchMap((currentUser) => this.profileClaimService.canClaimProfiles(currentUser)))
      .subscribe((canClaimProfiles) => {

        if (canClaimProfiles) {
          this.processingCreate$.next(false);
          const modal = this.modalService.open(ClaimItemSelectorComponent);
          modal.componentInstance.dso = this.user;
          modal.componentInstance.create.pipe(take(1)).subscribe(() => {
            this.createProfileFromScratch();
          });
        } else {
          this.createProfileFromScratch();
        }

      });
  }

  /**
   * Navigate to the items section to show the profile item details.
   *
   * @param researcherProfile the current researcher profile
   */
  viewProfile(researcherProfile: ResearcherProfile): void {
    if (this.researcherProfileItemId != null) {
      this.router.navigate(['items', this.researcherProfileItemId]);
    }
  }

  /**
   * Delete the given researcher profile.
   *
   * @param researcherProfile the profile to delete
   */
  deleteProfile(researcherProfile: ResearcherProfile): void {
    this.processingDelete$.next(true);
    this.researcherProfileService.delete(researcherProfile)
      .subscribe((deleted) => {
        if (deleted) {
          this.researcherProfile$.next(null);
          this.researcherProfileItemId = null;
        }
        this.processingDelete$.next(false);
      });
  }

  /**
   * Toggle the visibility of the given researcher profile.
   *
   * @param researcherProfile the profile to update
   */
  toggleProfileVisibility(researcherProfile: ResearcherProfile): void {
    this.researcherProfileService.setVisibility(researcherProfile, !researcherProfile.visible)
      .subscribe();
  }

  /**
   * Return a boolean representing if a delete operation is pending.
   *
   * @return {Observable<boolean>}
   */
  isProcessingDelete(): Observable<boolean> {
    return this.processingDelete$.asObservable();
  }

  /**
   * Return a boolean representing if a create operation is pending.
   *
   * @return {Observable<boolean>}
   */
  isProcessingCreate(): Observable<boolean> {
    return this.processingCreate$.asObservable();
  }

  createProfileFromScratch() {
    this.processingCreate$.next(true);
    this.researcherProfileService.create().pipe(
      getFirstCompletedRemoteData()
    ).subscribe((remoteData) => {
      this.processingCreate$.next(false);
      if (remoteData.isSuccess) {
        this.initResearchProfile();
        this.notificationService.success(this.translationService.get('researcher.profile.create.success'));
      } else {
        this.notificationService.error(this.translationService.get('researcher.profile.create.fail'));
      }
    });
  }

  private initResearchProfile(): void {
    this.researcherProfileService.findById(this.user.id).pipe(
      take(1),
      filter((researcherProfile) => isNotEmpty(researcherProfile)),
      tap((researcherProfile) => this.researcherProfile$.next(researcherProfile)),
      mergeMap((researcherProfile) => this.researcherProfileService.findRelatedItemId(researcherProfile)),
    ).subscribe((itemId: string) => {
      this.researcherProfileItemId = itemId;
    });
  }

}
