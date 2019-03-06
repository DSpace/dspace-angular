import { Component, Input, OnInit } from '@angular/core';
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
};

@Component({
  selector: 'ds-dso-selector-modal-wrapper',
  templateUrl: './dso-selector-modal-wrapper.component.html',
})
export abstract class DSOSelectorModalWrapperComponent implements OnInit {
  @Input() dsoRD$: Observable<RemoteData<DSpaceObject>>;
  objectType: DSpaceObjectType;
  selectorType: DSpaceObjectType;
  action: SelectorActionType;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const typeString = this.selectorType.toString().toLowerCase();
    this.dsoRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data[typeString]));
  }

  selectObject(dso: DSpaceObject) {
    this.close();
    this.navigate(dso);
  }

  abstract navigate(dso: DSpaceObject);

  close() {
    this.activeModal.close();
  }
}
