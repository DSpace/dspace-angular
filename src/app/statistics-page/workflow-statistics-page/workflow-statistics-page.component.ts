import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { getFirstCompletedRemoteData, getPaginatedListPayload, getRemoteDataPayload } from '../../core/shared/operators';
import { WorkflowStepStatisticsService } from '../../core/statistics/workflow-step-statistics.service';
import { WorkflowStepStatistics } from '../../core/statistics/models/workflow-step-statistics.model';
import { CollectionSelectorComponent } from '../../my-dspace-page/collection-selector/collection-selector.component';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowOwnerStatisticsService } from '../../core/statistics/workflow-owner-statistics.service';
import { WorkflowOwnerStatistics } from '../../core/statistics/models/workflow-owner-statistics.model';

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

  constructor( private workflowStepStatisticsService: WorkflowStepStatisticsService,
    private workflowOwnerStatisticsService: WorkflowOwnerStatisticsService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private translateService: TranslateService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.searchByDateRange(null, null, null, this.max);
    this.searchCurrentWorkflow();
  }

  onSearchFilterChange() {
    this.searchByDateRange(this.parseDate(this.dateFrom),this.parseDate(this.dateTo), this.collectionId, this.max);
  }

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

  private searchByDateRange(startDate: string, endDate: string, collectionId: string, limit: number) {

    this.workflowStepStatisticsService.searchByDateRange(startDate, endDate, collectionId, limit).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowSteps) => {
      this.workflowSteps$.next(workflowSteps);
    });

    this.workflowOwnerStatisticsService.searchByDateRange(startDate, endDate, collectionId, limit).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowOwners) => {
      this.workflowOwners$.next(workflowOwners);
    });

  }

  private searchCurrentWorkflow() {
    this.workflowStepStatisticsService.searchCurrent().pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1)
    ).subscribe((workflowSteps) => {
      this.currentWorkflowSteps$.next(workflowSteps);
    });
  }

  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.collectionId = null;
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.max = null;
    this.searchByDateRange(null, null, null, this.max);
  }

  resetCollectionFilter() {
    this.collectionId = null;
    this.collectionName = this.translateService.instant('statistics.workflow.page.collection');
    this.onSearchFilterChange();
  }

  parseDate(dateObject: NgbDateStruct) {
    if ( !dateObject ) {
      return null;
    }
    const date: NgbDate = new NgbDate(dateObject.year, dateObject.month, dateObject.day);
    return this.ngbDateParserFormatter.format(date);
  }

  showActionCounts(currentWorkflowStep: any, content: any) {
    this.selectedActionCounts = currentWorkflowStep.actionCounts;
    this.actionsModalRef = this.modalService.open(content);
  }

  closeActionsModal() {
    this.actionsModalRef.close();
  }

}
