import {
  Component, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface BoxDataModel {
  boxId: string;
  boxName: string;
  mandatory?: boolean;
  animations?: boolean;
  [propName: string]: any;
}

/**
 * An abstract model class for a submission edit form box.
 */
export class BoxModelComponent implements BoxDataModel, OnInit {
  @Input() boxId: string;
  @Input() boxName: string;
  @Input() animations: boolean;
  @Input() mandatory: boolean;

  ngOnInit() {
    // this.viewContainerRef.createEmbeddedView(this.boxContainer);
  }

}
