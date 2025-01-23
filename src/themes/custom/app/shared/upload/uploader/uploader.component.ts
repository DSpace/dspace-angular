import { Component, } from '@angular/core';

import {UploaderComponent as BaseComponent} from '../../../../../../app/shared/upload/uploader/uploader.component';

@Component({
  selector: 'ds-uploader',
  // templateUrl: 'uploader.component.html',
  templateUrl: '../../../../../../app/shared/upload/uploader/uploader.component.html',
  styleUrls: ['../../../../../../app/shared/upload/uploader/uploader.component.scss'],
})

export class UploaderComponent extends  BaseComponent{}
