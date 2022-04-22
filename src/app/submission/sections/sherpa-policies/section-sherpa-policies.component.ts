import { WorkspaceitemSectionSherpaPoliciesObject } from './../../../core/submission/models/workspaceitem-section-sherpa-policies.model';
import { SectionSherpaPoliciesService } from './section-sherpa-policies.service';
import { Component, Inject, ViewChildren, QueryList } from '@angular/core';

import { Observable, of } from 'rxjs';

import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionModelComponent } from '../models/section.model';

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
   * Initialize instance variables
   *
   * @param {SectionsService} sectionService
   * @param {SectionDataObject} injectedSectionData
   * @param {SectionSherpaPoliciesService} sectionSherpaPoliciesService
   * @param {string} injectedSubmissionId
   */
  constructor(
    protected sectionService: SectionsService,
    private sectionSherpaPoliciesService: SectionSherpaPoliciesService,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(undefined, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  // tslint:disable-next-line:no-empty
  onSectionDestroy() {

  }

  ngAfterViewInit() {
    this.acc.forEach(accordion => {
      accordion.expandAll();
    });
  }


  /**
   * Initialize all instance variables and retrieve collection default access conditions
   */
  protected onSectionInit(): void {
    this.sectionSherpaPoliciesService.getSherpaPoliciesData(this.submissionId, this.sectionData.id).subscribe((sherpaPolicies: WorkspaceitemSectionSherpaPoliciesObject) => {
      this.sherpaPoliciesData = sherpaPolicies;
    });
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

}
