import {
  Component, ComponentRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../submission.reducers';
import { BitstreamService } from './bitstream/bitstream.service';
import {SubmissionService} from "../submission.service";

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
  @Input() submissionState: Store<SubmissionState>;
  @Input() bitstreamService: BitstreamService;
  @Input() submissionService: SubmissionService;
}
