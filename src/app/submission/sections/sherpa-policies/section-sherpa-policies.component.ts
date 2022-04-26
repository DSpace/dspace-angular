import { JsonPatchOperationPathCombiner } from './../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from './../../../core/json-patch/builder/json-patch-operations-builder';
import { WorkspaceitemSectionSherpaPoliciesObject } from './../../../core/submission/models/workspaceitem-section-sherpa-policies.model';
import { SectionSherpaPoliciesService } from './section-sherpa-policies.service';
import { Component, Inject, ViewChildren, QueryList } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';

import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionModelComponent } from '../models/section.model';
import { SubmissionService } from '../../submission.service';
import { hasValue } from '../../../shared/empty.util';

/**
 * This component represents a section for managing item's access conditions.
 */
@Component({
  selector: 'ds-section-sherpa-policies',
  templateUrl: './section-sherpa-policies.component.html',
  styleUrls: ['./section-sherpa-policies.component.scss']
})
@renderSectionFor(SectionsType.SherpaPolicies)
export class SubmissionSectionSherpaPoliciesComponent extends SectionModelComponent {

  @ViewChildren('acc', { emitDistinctChangesOnly: true }) acc: QueryList<any>;

  /**
   * The accesses section data
   * @type {WorkspaceitemSectionAccessesObject}
   */
  public sherpaPoliciesData: WorkspaceitemSectionSherpaPoliciesObject;

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
   * Initialize instance variables
   *
   * @param {SectionsService} sectionService
   * @param {SectionDataObject} injectedSectionData
   * @param {SectionSherpaPoliciesService} sectionSherpaPoliciesService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionService} submissionService
   * @param {string} injectedSubmissionId
   */
  constructor(
    protected sectionService: SectionsService,
    private sectionSherpaPoliciesService: SectionSherpaPoliciesService,
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
   * Expand all primary accordions
   */
  ngAfterViewInit() {
    this.acc.forEach(accordion => {
      accordion.expandAll();
    });
  }


  /**
   * Initialize all instance variables and retrieve collection default access conditions
   */
  protected onSectionInit(): void {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.subs.push(
      this.sectionSherpaPoliciesService.getSherpaPoliciesData(this.submissionId, this.sectionData.id).subscribe((sherpaPolicies: WorkspaceitemSectionSherpaPoliciesObject) => {
        this.sherpaPoliciesData = sherpaPolicies;
      })
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
   * Refresh sherpa information
   */
  refresh() {
    this.operationsBuilder.remove(this.pathCombiner.getPath('retrievalTime'));
    this.submissionService.dispatchSaveSection(this.submissionId, this.sectionData.id);
  }

}
