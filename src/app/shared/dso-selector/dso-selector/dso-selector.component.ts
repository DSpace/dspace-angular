import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { SearchResult } from '../../../+search-page/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-dso-selector',
  // styleUrls: ['./dso-selector.component.scss'],
  templateUrl: './dso-selector.component.html'
})

/**
 * Component to render a list of DSO's of which one can be selected
 * The user can search the list by using the input field
 */
export class DSOSelectorComponent implements OnInit {

  /**
   * The initially selected DSO's uuid
   */
  @Input() currentDSOId: string;

  /**
   * The type of DSpace objects this components shows a list of
   */
  @Input() type: DSpaceObjectType;

  /**
   * Emits the selected Object when a user selects it in the list
   */
  @Output() onSelect: EventEmitter<DSpaceObject> = new EventEmitter();

  /**
   * Input form control to query the list
   */
  public input: FormControl = new FormControl();

  /**
   * Default pagination for this feature
   */
  private defaultPagination = { id: 'dso-selector', currentPage: 1, pageSize: 5 } as any;

  /**
   * List with search results of DSpace objects for the current query
   */
  listEntries$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;

  /**
   * List of element references to all elements
   */
  @ViewChildren('listEntryElement') listElements: QueryList<ElementRef>;

  /**
   * Time to wait before sending a search request to the server when a user types something
   */
  debounceTime = 500;

  constructor(private searchService: SearchService) {
  }

  /**
   * Fills the listEntries$ variable with search results based on the input field's current value
   * The search will always start with the initial currentDSOId value
   */
  ngOnInit(): void {
    this.input.setValue(this.currentDSOId);
    this.listEntries$ = this.input.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        startWith(this.currentDSOId),
        switchMap((query) => {
            return this.searchService.search(
              new PaginatedSearchOptions({
                query: query,
                dsoType: this.type,
                pagination: this.defaultPagination
              })
            )
          }
        )
      )
  }

  /**
   * Set focus on the first list element when there is only one result
   */
  selectSingleResult(): void {
    if (this.listElements.length > 0) {
      this.listElements.first.nativeElement.click();
    }
  }
}
