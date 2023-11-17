import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  getFirstSucceededRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { WorkflowStepStatisticsDataService } from '../../core/statistics/workflow-step-statistics-data.service';
import { WorkflowStepStatistics } from '../../core/statistics/models/workflow-step-statistics.model';
import { CollectionSelectorComponent } from '../../my-dspace-page/collection-selector/collection-selector.component';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowOwnerStatisticsDataService } from '../../core/statistics/workflow-owner-statistics-data.service';
import { WorkflowOwnerStatistics } from '../../core/statistics/models/workflow-owner-statistics.model';
import { AlertType } from '../../shared/alert/alert-type';

/**
 * Component related to the WORKFLOW statistics page.
 */
@Component({
  selector: 'ds-workflow-statistics',
  templateUrl: './workflow-statistics-page.component.html',
  styleUrls: ['./workflow-statistics-page.component.scss']
})
export class WorkflowStatisticsPageComponent implements OnInit {

  workflowSteps$ = new BehaviorSubject<WorkflowStepStatistics[]>([]);

  workflowOwners$ = new BehaviorSubject<WorkflowOwnerStatistics[]>([]);

  currentWorkflowSteps$ = new BehaviorSubject<WorkflowStepStatistics[]>([]);

  dateFrom: NgbDateStruct;

  dateTo: NgbDateStruct;

  collectionName: string;

  collectionId: string;

  max: number;

  selectedActionCounts: Map<string, number>;

  actionsModalRef: NgbModalRef;

  AlertTypeEnum = AlertType;

  constructor( private workflowStepStatisticsService: WorkflowStepStatisticsDataService,
    private workflowOwnerStatisticsService: WorkflowOwnerStatisticsDataService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private translateService: TranslateService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.searchByDateRange(null, null, null, this.max);
    this.searchCurrentWorkflow();
  }

  /**
   * Perform a search when the search filters change.
   */
  onSearchFilterChange() {
    this.searchByDateRange(this.parseDate(this.dateFrom),this.parseDate(this.dateTo), this.collectionId, this.max);
  }

  /**
   * Open the CollectionSelectorComponent modal to select the collection to search for.
   */
  onCollectionFilterButtonClick() {
    const modalRef = this.modalService.open(CollectionSelectorComponent);
    modalRef.result.then( (result) => {
      if (result) {
        this.collectionName = result.name;
        this.collectionId = result.uuid;
        this.onSearchFilterChange();
      }
    });
  }

  /**
   * Search for the workflow steps and workflow owners using the provided filters.
   *
   * @param startDate the start date to search for
   * @param endDate the end date to search for
   * @param collectionId the collection id
   * @param limit the limit to apply
   * @private
   */
  private searchByDateRange(startDate: string, endDate: string, collectionId: string, limit: number) {

    this.workflowStepStatisticsService.searchByDateRange(startDate, endDate, collectionId, limit).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowSteps) => {
      this.workflowSteps$.next(workflowSteps);
    });

    this.workflowOwnerStatisticsService.searchByDateRange(startDate, endDate, collectionId, limit).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowOwners) => {
      this.workflowOwners$.next(workflowOwners);
    });

  }

  /**
   * Search for the current workflows.
   * @private
   */
  private searchCurrentWorkflow() {
    this.workflowStepStatisticsService.searchCurrent().pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowSteps) => {
      this.currentWorkflowSteps$.next(workflowSteps);
    });
  }

  /**
   * Reset all the search filters.
   */
  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.collectionId = null;
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.max = null;
    this.searchByDateRange(null, null, null, this.max);
  }

  /**
   * Reset the collection filter.
   */
  resetCollectionFilter() {
    this.collectionId = null;
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.onSearchFilterChange();
  }

  /**
   * Parse the incoming date object.
   *
   * @param dateObject the date to parse
   */
  parseDate(dateObject: NgbDateStruct) {
    if ( !dateObject ) {
      return null;
    }
    const date: NgbDate = new NgbDate(dateObject.year, dateObject.month, dateObject.day);
    return this.ngbDateParserFormatter.format(date);
  }

  /**
   * Open the modal to show the action counts detail.
   *
   * @param currentWorkflowStep the current workflow step to detail
   * @param content the modal to open
   */
  showActionCounts(currentWorkflowStep: any, content: any) {
    this.selectedActionCounts = currentWorkflowStep.actionCounts;
    this.actionsModalRef = this.modalService.open(content);
  }

  /**
   * Close the action counts modal.
   */
  closeActionsModal() {
    this.actionsModalRef.close();
  }

}
