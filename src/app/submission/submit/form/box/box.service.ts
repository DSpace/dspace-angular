import { ComponentFactoryResolver, Host, Injectable, OnInit, Optional, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { assign } from 'rxjs/util/assign';

import { BasicInformationBoxComponent } from './basic-information/submission-submit-form-box-basic-information.component';
import { DefaultBoxComponent } from './default/submission-submit-form-box-default.component';
import { BoxFactoryComponent, FactoryDataModel } from './box.factory';

import { SubmissionSubmitFormComponent } from '../submission-submit-form.component';

import { isUndefined } from '../../../../shared/empty.util';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BoxService {
  boxes = new Map();
  boxesList: any[] = [];
  boxesLoadedList: any[] = [];
  submitForm: SubmissionSubmitFormComponent;

  private _boxesAvailableList: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private _viewContainerRef: ViewContainerRef;

  constructor(private boxFactory: BoxFactoryComponent) {}

  initViewContainer(viewContainerRef: ViewContainerRef) {
    this._viewContainerRef = viewContainerRef;
    this.retrieveBoxes();
  }

  retrieveBoxes() {
    this.boxes.set('basic', {component: BasicInformationBoxComponent, inputs: {boxId: 'basic', boxName: 'Basic Information'}} as FactoryDataModel);
    this.boxes.set('indexing', {component: DefaultBoxComponent, inputs: {boxId: 'indexing', boxName: 'Indexing'}} as FactoryDataModel);
    this.boxes.set('license', {component: DefaultBoxComponent, inputs: {boxId: 'license', boxName: 'CC License'}} as FactoryDataModel);
    this.boxes.set('files', {component: DefaultBoxComponent, inputs: {boxId: 'files', boxName: 'Files and access condition'}} as FactoryDataModel);
    this.boxesList = [ 'basic', 'license', 'indexing', 'files' ];
  }

  getDeafultBoxList() {
    return [ 'basic', 'license' ];
  }

  getAvailableBoxList(): Observable<any> {
    return new Observable((fn) => this._boxesAvailableList.subscribe(fn));
  }

  getBoxNameById(boxId: string) {
    if (this.boxes.has(boxId)) {
      const boxItem: FactoryDataModel = this.boxes.get(boxId);
      return boxItem.inputs.boxName
    } else {
      throw Error(`Box '${boxId}' is undefined`);
    }
  }

  loadDefaultBox() {
    this.getDeafultBoxList().forEach((boxId) => {
      this._loadBox(boxId, true);
    });
  }

  private _loadBox(boxId: string, isDefault: boolean) {
    const boxItem: FactoryDataModel = this.boxes.get(boxId);
    // const viewContainerRef = this.submitForm.boxHost.viewContainerRef;
    boxItem.inputs = assign(boxItem.inputs, { mandatory: isDefault, animations: !isDefault });
    const componentRef = this.boxFactory.get(boxItem, this._viewContainerRef);
    const index = this._viewContainerRef.indexOf(componentRef.hostView);
    this._addToLoadedList(boxId);
  }

  addBox(boxId) {
    this._loadBox(boxId, false);
  }

  private _addToLoadedList(boxId) {
    this.boxesLoadedList.push(boxId);
    this._updateAvailableList();
  }

  private _removeFromLoadedList(boxId) {
    const index = this.boxesLoadedList.indexOf(boxId);
    this.boxesLoadedList.splice(index, 1);
    this._updateAvailableList();
  }

  private _updateAvailableList() {
    this.boxesAvailableList = this.boxesList.filter((boxId) => {
      return !this.boxesLoadedList.includes(boxId);
    })
  }
}
