import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing dso's inside a modal
 * Used to choose a dso from to import metadata of
 */
@Component({
  selector: 'ds-import-batch-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [NgIf, DSOSelectorComponent, TranslateModule],
})
export class ImportBatchSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.DSPACEOBJECT;
  selectorTypes = [DSpaceObjectType.COLLECTION];
  action = SelectorActionType.IMPORT_BATCH;
  /**
   * An event fired when the modal is closed
   */
  @Output()
  response = new EventEmitter<DSpaceObject>();

  constructor(protected activeModal: NgbActiveModal,
              protected route: ActivatedRoute) {
    super(activeModal, route);
  }

  /**
   * If the dso is a collection:
   */
  navigate(dso: DSpaceObject): Observable<null> {
    if (dso instanceof Collection) {
      this.response.emit(dso);
      return of(null);
    }
    this.response.emit(null);
    return of(null);
  }
}
