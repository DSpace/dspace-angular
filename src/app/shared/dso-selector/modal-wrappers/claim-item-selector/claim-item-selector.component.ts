import {
  AsyncPipe,
  NgForOf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BtnDisabledDirective } from 'src/app/shared/btn-disabled.directive';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getItemPageRoute } from '../../../../item-page/item-page-routing-paths';
import { ProfileClaimService } from '../../../../profile-page/profile-claim/profile-claim.service';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchResult } from '../../../search/models/search-result.model';
import { DSOSelectorModalWrapperComponent } from '../dso-selector-modal-wrapper.component';



@Component({
  selector: 'ds-claim-item-selector',
  templateUrl: './claim-item-selector.component.html',
  imports: [
    ListableObjectComponentLoaderComponent,
    NgForOf,
    TranslateModule,
    AsyncPipe,
    BtnDisabledDirective,
  ],
  standalone: true,
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
      (result) => this.listEntries$.next(result),
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
