import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ResourceType } from '../../core/shared/resource-type';

@Component({
  selector: 'ds-object-list-element',
  styleUrls: ['./object-list-element.component.scss'],
  templateUrl: './object-list-element.component.html'
})
export class ObjectListElementComponent {

  public type = ResourceType;

  @Input() object: DSpaceObject;

  data: any = {};

}
