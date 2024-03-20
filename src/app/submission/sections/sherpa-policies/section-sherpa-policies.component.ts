import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subscription,
} from 'rxjs';

import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { WorkspaceitemSectionSherpaPoliciesObject } from '../../../core/submission/models/workspaceitem-section-sherpa-policies.model';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import {
  hasValue,
  isEmpty,
} from '../../../shared/empty.util';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SubmissionService } from '../../submission.service';
import { SectionModelComponent } from '../models/section.model';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { MetadataInformationComponent } from './metadata-information/metadata-information.component';
import { PublicationInformationComponent } from './publication-information/publication-information.component';
import { PublisherPolicyComponent } from './publisher-policy/publisher-policy.component';

/**
 * This component represents a section for the sherpa policy informations structure.
 */
@Component({
  selector: 'ds-section-sherpa-policies',
  templateUrl: './section-sherpa-policies.component.html',
  styleUrls: ['./section-sherpa-policies.component.scss'],
  imports: [
    MetadataInformationComponent,
    NgbCollapseModule,
    AlertComponent,
    TranslateModule,
    PublisherPolicyComponent,
    NgIf,
    PublicationInformationComponent,
    AsyncPipe,
    VarDirective,
    NgForOf,
  ],
  standalone: true,
})
export class SubmissionSectionSherpaPoliciesComponent extends SectionModelComponent {

  /**
   * The accesses section data
   * @type {WorkspaceitemSectionAccessesObject}
   */
  public sherpaPoliciesData$: BehaviorSubject<WorkspaceitemSectionSherpaPoliciesObject> = new BehaviorSubject<WorkspaceitemSectionSherpaPoliciesObject>(null);

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = false;


  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * Initialize instance variables
   *
   * @param {SectionsService} sectionService
   * @param {SectionDataObject} injectedSectionData
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionService} submissionService
   * @param {string} injectedSubmissionId
   */
  constructor(
    protected sectionService: SectionsService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    private submissionService: SubmissionService,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {

    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }


  /**
   * Initialize all instance variables and retrieve collection default access conditions
   */
  protected onSectionInit(): void {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.subs.push(
      this.sectionService.getSectionData(this.submissionId, this.sectionData.id, this.sectionData.sectionType)
        .subscribe((sherpaPolicies: WorkspaceitemSectionSherpaPoliciesObject) => {
          this.sherpaPoliciesData$.next(sherpaPolicies);
        }),
    );
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    return of(true);
  }

  /**
   * Check if section has no data
   */
  hasNoData(): boolean {
    return isEmpty(this.sherpaPoliciesData$.value);
  }

  /**
   * Refresh sherpa information
   */
  refresh() {
    this.operationsBuilder.remove(this.pathCombiner.getPath('retrievalTime'));
    this.submissionService.dispatchSaveSection(this.submissionId, this.sectionData.id);
  }

}
