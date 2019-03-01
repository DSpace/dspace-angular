import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { SearchResult } from '../../../+search-page/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

interface DSOSelectListEntry {
  parents: DSpaceObject[],
  dso: DSpaceObject
}

@Component({
  selector: 'ds-dso-selector',
  // styleUrls: ['./dso-selector.component.scss'],
  templateUrl: './dso-selector.component.html'
})
export class DSOSelectorComponent implements OnInit, AfterViewInit {
  @Input() currentDSOId: string;
  @Input() type: DSpaceObjectType;

  public input: FormControl = new FormControl();
  // private subs: Subscription[] = [];
  private defaultPagination = { id: 'dso-selector', currentPage: 1, pageSize: 5 } as any;
  listEntries$: Observable<DSOSelectListEntry[]>;

  constructor(private searchService: SearchService) {

  }

  ngOnInit(): void {
    this.listEntries$ = this.input.valueChanges
      .pipe(
        switchMap((query) => {
            return this.searchService.search(
              new PaginatedSearchOptions({
                query: query,
                dsoType: this.type,
                pagination: this.defaultPagination
              })
            )
          }
        ),
        map((searchResultsRD: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
          return searchResultsRD.payload.page.map(
            (searchResult: SearchResult<DSpaceObject>) => {
              let dso = searchResult.dspaceObject;
              return {
                parents: this.retrieveParentList(dso),
                dso
              } as DSOSelectListEntry
            }
          )
        })
      );

  }


  retrieveParentList(dso: DSpaceObject, parents: DSpaceObject[] = []) {
    return [{name: 'Test Community'} as any];
    // if (hasValue(dso.owner)) {
    //   dso.owner.pipe(
    //     first(),
    //   ).subscribe((parentRD) => {
    //     const newDSO: DSpaceObject = parentRD.payload;
    //     parents = [...this.retrieveParentList(newDSO, parents), newDSO];
    //   });
    // }
    // return parents;
  }

  // ngOnDestroy(): void {
  //   this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  // }

  onSelect(event) {

  }

  onClose() {

  }

  ngAfterViewInit(): void {
    this.input.setValue(this.currentDSOId);
  }
}
