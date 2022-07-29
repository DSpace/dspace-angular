import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { SearchResult } from '../../../search/models/search-result.model';
import { DSOSelectorModalWrapperComponent } from '../dso-selector-modal-wrapper.component';
import { getItemPageRoute } from '../../../../item-page/item-page-routing-paths';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { ProfileClaimService } from '../../../../profile-page/profile-claim/profile-claim.service';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';



@Component({
  selector: 'ds-claim-item-selector',
  templateUrl: './claim-item-selector.component.html'
})
export class ClaimItemSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {

  @Input() dso: DSpaceObject;

  listEntries$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> =  new BehaviorSubject(null);

  viewMode = ViewMode.ListElement;

  // enum to be exposed
  linkTypes = CollectionElementLinkType;

  checked = false;

  @Output() create: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router,
              private profileClaimService: ProfileClaimService) {
    super(activeModal, route);
  }

  ngOnInit(): void {
    this.profileClaimService.searchForSuggestions(this.dso as EPerson).subscribe(
      (result) => this.listEntries$.next(result)
    );
  }

  // triggered when an item is selected
  selectItem(dso: DSpaceObject): void {
    this.close();
    this.navigate(dso);
  }

  navigate(dso: DSpaceObject) {
    this.router.navigate([getItemPageRoute(dso as Item)]);
  }

  toggleCheckbox() {
    this.checked = !this.checked;
  }

  createFromScratch() {
    this.create.emit();
    this.close();
  }

}
