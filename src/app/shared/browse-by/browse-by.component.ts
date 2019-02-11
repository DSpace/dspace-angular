import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeIn, fadeInOut } from '../animations/fade';
import { Observable } from 'rxjs';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { getStartsWithComponent } from './browse-by-starts-with/browse-by-starts-with-decorator';

export enum BrowseByStartsWithType {
  text = 'Text',
  date = 'Date'
}

@Component({
  selector: 'ds-browse-by',
  styleUrls: ['./browse-by.component.scss'],
  templateUrl: './browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component to display a browse-by page for any ListableObject
 */
export class BrowseByComponent implements OnInit {
  /**
   * The i18n message to display as title
   */
  @Input() title: string;

  /**
   * The list of objects to display
   */
  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * The pagination configuration used for the list
   */
  @Input() paginationConfig: PaginationComponentOptions;

  /**
   * The sorting configuration used for the list
   */
  @Input() sortConfig: SortOptions;

  @Input() type = BrowseByStartsWithType.text;

  @Input() startsWithOptions = [];

  @Input() enableArrows = false;

  @Input() hideGear = false;

  @Output() prev = new EventEmitter<boolean>();

  @Output() next = new EventEmitter<boolean>();

  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() sortDirectionChange = new EventEmitter<SortDirection>();

  objectInjector: Injector;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;

  public constructor(private injector: Injector) {

  }

  goPrev() {
    this.prev.emit(true);
  }

  goNext() {
    this.next.emit(true);
  }

  doPageSizeChange(size) {
    this.paginationConfig.pageSize = size;
    this.pageSizeChange.emit(size);
  }

  doSortDirectionChange(direction) {
    this.sortConfig.direction = direction;
    this.sortDirectionChange.emit(direction);
  }

  getStartsWithComponent() {
    return getStartsWithComponent(this.type);
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: 'startsWithOptions', useFactory: () => (this.startsWithOptions), deps:[] }],
      parent: this.injector
    });
  }

}
