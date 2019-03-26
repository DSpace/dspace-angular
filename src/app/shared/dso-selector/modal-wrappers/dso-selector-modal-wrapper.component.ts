import { Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { RemoteData } from '../../../core/data/remote-data';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';

export enum SelectorActionType {
  CREATE = 'create',
  EDIT = 'edit'
}

/**
 * Abstract base class that represents a wrapper for modal content used to select a DSpace Object
 */

@Injectable()
export abstract class DSOSelectorModalWrapperComponent implements OnInit {
  /**
   * The current page's DSO
   */
  @Input() dsoRD$: Observable<RemoteData<DSpaceObject>>;

  /**
   * The type of the DSO that's being edited or created
   */
  objectType: DSpaceObjectType;

  /**
   * The type of DSO that can be selected from this list
   */
  selectorType: DSpaceObjectType;

  /**
   * The type of action to perform
   */
  action: SelectorActionType;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute) {
  }

  /**
   * Get de current page's DSO based on the selectorType
   */
  ngOnInit(): void {
    const typeString = this.selectorType.toString().toLowerCase();
    this.dsoRD$ = this.route.root.firstChild.firstChild.data.pipe(map((data) => data[typeString]));
  }

  /**
   * Method called when an object has been selected
   * @param dso The selected DSpaceObject
   */
  selectObject(dso: DSpaceObject) {
    this.close();
    this.navigate(dso);
  }

  /**
   * Navigate to a page based on the DSpaceObject provided
   * @param dso The DSpaceObject which can be used to calculate the page to navigate to
   */
  abstract navigate(dso: DSpaceObject);

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }
}
