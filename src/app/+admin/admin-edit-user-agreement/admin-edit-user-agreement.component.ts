import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Operation } from 'fast-json-patch';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScriptDataService } from 'src/app/core/data/processes/script-data.service';
import { SiteDataService } from 'src/app/core/data/site-data.service';
import { Site } from 'src/app/core/shared/site.model';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

/**
 * Component that represents the user agreement edit page for administrators.
 */
@Component({
  selector: 'ds-admin-edit-user-agreement',
  templateUrl: './admin-edit-user-agreement.component.html',
})
export class AdminEditUserAgreementComponent implements OnInit, OnDestroy {

  userAgreementText = '';
  site: Site;

  subs: Subscription[] = [];

  USER_AGREEMENT_TEXT_METADATA = 'dc.rights';

  USER_AGREEMENT_METADATA = 'dspace.agreements.end-user';

  constructor(private siteService: SiteDataService,
              private modalService: NgbModal,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private scriptDataService: ScriptDataService ) {

  }

  ngOnInit(): void {
    this.subs.push(this.siteService.find().subscribe((site) => {
      this.site = site;
      const hasRights = site.hasMetadata(this.USER_AGREEMENT_TEXT_METADATA);
      this.userAgreementText = hasRights ? site.firstMetadataValue(this.USER_AGREEMENT_TEXT_METADATA) : 'No content';
    }));
  }

  /**
   * Show the confirm modal to choose if  all users must be forced to accept the new user agreement or not.
   * @param content the modal content
   */
  confirmEdit(content: any) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result !== 'cancel') {
          const operation = this.getOperationToEditText();
          this.subs.push(this.siteService.patch(this.site, [operation])
            .subscribe((restResponse) => {
              if (restResponse.isSuccessful) {
                this.notificationsService.success(this.translateService.get('admin.edit-user-agreement.success'));
                if ( result === 'edit-with-reset' ) {
                  this.deleteAllUserAgreementMetadataValues();
                }
              } else {
                this.notificationsService.error(this.translateService.get('admin.edit-user-agreement.error'));
              }
            })
          );
        }
      }
    );
  }

  /**
   * Returns the operation to update the user agreement text metadata.
   */
  private getOperationToEditText(): Operation {
    return {
      op: this.site.hasMetadata(this.USER_AGREEMENT_TEXT_METADATA) ? 'replace' : 'add',
      path: '/metadata/' + this.USER_AGREEMENT_TEXT_METADATA,
      value: this.userAgreementText
    };
  }

  /**
   * Invoke the script to delete all the the user agreement text metadata values.
   */
  private deleteAllUserAgreementMetadataValues() {
    this.subs.push(this.scriptDataService.invoke('metadata-deletion', [{name: '-metadata', value: this.USER_AGREEMENT_METADATA}], []).subscribe());
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
