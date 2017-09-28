import {
  Component, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface PanelDataModel {
  panelId: string;
  panelHeader: string;
  mandatory: boolean;
  submissionId: string;
  [propName: string]: any;
}

/**
 * An abstract model class for a submission edit form panel.
 */
export class PanelModelComponent implements PanelDataModel {
  @Input() panelId: string;
  @Input() panelHeader: string;
  @Input() mandatory: boolean;
  @Input() submissionId: string;

}
