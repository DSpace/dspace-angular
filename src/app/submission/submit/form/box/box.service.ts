import { Injectable } from '@angular/core';

import { BoxItem } from './box.model';
import { BasicInformationBoxComponent } from './basic-information/submission-submit-form-box-basic-information.component';

@Injectable()
export class BoxService {

  getBoxes() {
    const boxList = new Map();
    boxList.set('basic', new BoxItem(BasicInformationBoxComponent, {idBox: 'basic', name: 'Basic Information'}));
    boxList.set('indexing', new BoxItem(BasicInformationBoxComponent, {idBox: 'indexing', name: 'Indexing'}));
    boxList.set('license', new BoxItem(BasicInformationBoxComponent, {idBox: 'license', name: 'CC License'}));
    boxList.set('files', new BoxItem(BasicInformationBoxComponent, {idBox: 'files', name: 'Files and access condition'}));
    return boxList;
  }

  getDeafultBoxList() {
    return [
      {idBox: 'basic', name: 'Basic Information'},
      {idBox: 'license', name: 'CC License'},
    ]
  }

  getAvailableBoxList() {
    return [
      {idBox: 'indexing', name: 'Indexing'},
      {idBox: 'files', name: 'Files and access condition'}
    ]
  }
}
