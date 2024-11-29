import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
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
import { Subscription } from 'rxjs';

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
  imports: [NgIf, RouterLink, PaginationComponent, NgFor, VarDirective, AsyncPipe, DatePipe, TranslateModule, NgTemplateOutlet, ProcessOverviewTableComponent],
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

  constructor(protected processOverviewService: ProcessOverviewService,
              protected modalService: NgbModal,
              public processBulkDeleteService: ProcessBulkDeleteService,
  ) {
  }

  ngOnInit(): void {
    this.processBulkDeleteService.clearAllProcesses();
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
