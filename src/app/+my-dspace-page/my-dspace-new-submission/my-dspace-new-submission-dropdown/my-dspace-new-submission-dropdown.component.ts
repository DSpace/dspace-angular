import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PaginatedList } from '../../../core/data/paginated-list';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FindListOptions } from '../../../core/data/request.models';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { hasValue } from '../../../shared/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateItemParentSelectorComponent } from 'src/app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';

/**
 * This component represents the new submission dropdown
 */
@Component({
  selector: 'ds-my-dspace-new-submission-dropdown',
  styleUrls: ['./my-dspace-new-submission-dropdown.component.scss'],
  templateUrl: './my-dspace-new-submission-dropdown.component.html'
})
export class MyDSpaceNewSubmissionDropdownComponent implements OnDestroy, OnInit {

  /**
   * Representing if dropdown list is initialized
   */
  initialized = false;

  /**
   * Representing if dropdown list is loading
   */
  loading = false;

  /**
   * The list of available entity type
   */
  availableEntityTypeList: string[];

  /**
   * Represents the state of a paginated response
   */
  pageInfo: PageInfo;

  /**
   * Subscription to unsubscribe from
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {entityTypeService} entityTypeService
   */
  constructor(private changeDetectorRef: ChangeDetectorRef,
              private entityTypeService: EntityTypeService,
              private modalService: NgbModal) {
    this.availableEntityTypeList = [];
    this.pageInfo = new PageInfo();
    this.pageInfo.elementsPerPage = 10;
    this.pageInfo.currentPage = 1;
  }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.loadEntityTypes(this.toPageOptions());
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  loadEntityTypes(pageInfo: FindListOptions) {
    this.loading = true;
    this.subs.push(
      this.entityTypeService.getAllAuthorizedRelationshipType(pageInfo).pipe(
        getFirstSucceededRemoteDataPayload()
      ).subscribe((list: PaginatedList<ItemType>) => {
          this.initialized = true
          this.loading = false;
          this.pageInfo.totalPages = list.pageInfo.totalPages;
          this.availableEntityTypeList = this.availableEntityTypeList
            .concat(list.page.map((type) => type.label));
          this.changeDetectorRef.detectChanges();
        },
        () => {
          this.initialized = true;
          this.loading = false;
        },
        () => {
          this.initialized = true;
          this.loading = false;
        }));
  }

  onScroll() {
    if (!this.loading && this.pageInfo.currentPage < this.pageInfo.totalPages) {
      this.pageInfo.currentPage++;
      this.loadEntityTypes(this.toPageOptions());
    }
  }

  hasMultipleOptions(): boolean {
    return this.availableEntityTypeList && this.availableEntityTypeList.length > 1;
  }

  private toPageOptions() {
    return {
      currentPage: this.pageInfo.currentPage,
      elementsPerPage: this.pageInfo.elementsPerPage,
    } as FindListOptions;
  }

  /**
   * Method called on clicking the button "New Submition", It opens a dialog for
   * select a collection.
   */
  openDialog(idx: number) {
    const modalRef = this.modalService.open(CreateItemParentSelectorComponent);
    modalRef.componentInstance.metadata = 'relationship.type';
    if (hasValue(this.availableEntityTypeList) && this.availableEntityTypeList.length > 0) {
      modalRef.componentInstance.metadatavalue = this.availableEntityTypeList[idx];
    }
  }
}
