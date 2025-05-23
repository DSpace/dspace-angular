import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';

import { Metadata } from '../../../core/shared/metadata.utils';
import { WorkspaceitemSectionDuplicatesObject } from '../../../core/submission/models/workspaceitem-section-duplicates.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { getItemModuleRoute } from '../../../item-page/item-page-routing-paths';
import { AlertType } from '../../../shared/alert/alert-type';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SubmissionService } from '../../submission.service';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';

/**
 * Detect duplicates step
 *
 * @author Kim Shepherd
 */
@Component({
  selector: 'ds-submission-section-duplicates',
  templateUrl: './section-duplicates.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    AsyncPipe,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})

export class SubmissionSectionDuplicatesComponent extends SectionModelComponent implements OnInit {
  protected readonly Metadata = Metadata;
  /**
   * The Alert categories.
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * Variable to track if the section is loading.
   * @type {boolean}
   */
  public isLoading = true;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize instance variables.
   *
   * @param {TranslateService} translate
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected translate: TranslateService,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /**
   * Initialize all instance variables and retrieve configuration.
   */
  onSectionInit() {
    this.isLoading = false;
  }

  /**
   * Check if identifier section has read-only visibility
   */
  isReadOnly(): boolean {
    return true;
  }

  /**
   * Unsubscribe from all subscriptions, if needed.
   */
  onSectionDestroy(): void {
    return;
  }

  /**
   * Get section status. Because this simple component never requires human interaction, this is basically
   * always going to be the opposite of "is this section still loading". This is not the place for API response
   * error checking but determining whether the step can 'proceed'.
   *
   * @return Observable<boolean>
   *     the section status
   */
  public getSectionStatus(): Observable<boolean> {
    return of(!this.isLoading);
  }

  /**
   * Get duplicate data as observable from the section data
   */
  public getDuplicateData(): Observable<WorkspaceitemSectionDuplicatesObject> {
    return this.sectionService.getSectionData(this.submissionId, this.sectionData.id, this.sectionData.sectionType) as
      Observable<WorkspaceitemSectionDuplicatesObject>;
  }

  /**
   * Construct and return an item link for use with a preview item stub
   * @param uuid
   */
  public getItemLink(uuid: any) {
    return new URLCombiner(getItemModuleRoute(), uuid).toString();
  }


}
