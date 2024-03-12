import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector/dso-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../../dso-selector/modal-wrappers/dso-selector-modal-wrapper.component';

/**
 * Component to wrap a button - to select the entire repository -
 * and a list of parent communities - for scope selection
 * inside a modal
 * Used to select a scope
 */
@Component({
  selector: 'ds-scope-selector-modal',
  styleUrls: ['./scope-selector-modal.component.scss'],
  templateUrl: './scope-selector-modal.component.html',
  standalone: true,
  imports: [DSOSelectorComponent, TranslateModule],
})
export class ScopeSelectorModalComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  /**
   * The types of DSO that can be selected from this list
   */
  selectorTypes = [DSpaceObjectType.COMMUNITY, DSpaceObjectType.COLLECTION];

  /**
   * The type of action to perform
   */
  action = SelectorActionType.SET_SCOPE;

  /**
   * Emits the selected scope as a DSpaceObject when a user clicks one
   */
  scopeChange = new EventEmitter<DSpaceObject>();

  /**
   * Default DSO ordering
   */
  defaultSort = new SortOptions(environment.comcolSelectionSort.sortField, environment.comcolSelectionSort.sortDirection as SortDirection);

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute) {
    super(activeModal, route);
  }

  navigate(dso: DSpaceObject) {
    /* Handle complex search navigation in underlying component */
    this.scopeChange.emit(dso);
  }
}
