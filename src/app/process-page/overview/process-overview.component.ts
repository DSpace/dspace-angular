import {
  AsyncPipe,
  DatePipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { hasValue } from '../../shared/empty.util';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ProcessStatus } from '../processes/process-status.model';
import { ProcessBulkDeleteService } from './process-bulk-delete.service';
import {
  ProcessOverviewService,
  ProcessSortField,
} from './process-overview.service';
import { ProcessOverviewTableComponent } from './table/process-overview-table.component';

@Component({
  selector: 'ds-process-overview',
  templateUrl: './process-overview.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    DatePipe,
    NgTemplateOutlet,
    PaginationComponent,
    ProcessOverviewTableComponent,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
})
/**
 * Component displaying a list of all processes in a paginated table
 */
export class ProcessOverviewComponent implements OnInit, OnDestroy {

  // Enums are redeclared here so they can be used in the template
  protected readonly ProcessStatus = ProcessStatus;
  protected readonly ProcessSortField = ProcessSortField;

  private modalRef: any;

  isProcessingSub: Subscription;

  isProcessing$: Observable<boolean>;

  constructor(protected processOverviewService: ProcessOverviewService,
              protected modalService: NgbModal,
              public processBulkDeleteService: ProcessBulkDeleteService,
  ) {
  }

  ngOnInit(): void {
    this.processBulkDeleteService.clearAllProcesses();
    this.isProcessing$ = this.processBulkDeleteService.isProcessing$();
  }

  ngOnDestroy(): void {
    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
  }

  /**
   * Open a given modal.
   * @param content   - the modal content.
   */
  openDeleteModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Close the modal.
   */
  closeModal() {
    this.modalRef.close();
  }

  /**
   * Delete the previously selected processes using the processBulkDeleteService
   * After the deletion has started, subscribe to the isProcessing$ and when it is set
   * to false after the processing is done, close the modal and reinitialise the processes
   */
  deleteSelected() {
    this.processBulkDeleteService.deleteSelectedProcesses();

    if (hasValue(this.isProcessingSub)) {
      this.isProcessingSub.unsubscribe();
    }
    this.isProcessingSub = this.processBulkDeleteService.isProcessing$()
      .subscribe((isProcessing) => {
        if (!isProcessing) {
          this.closeModal();
        }
      });
  }
}
