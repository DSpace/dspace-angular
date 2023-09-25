import {
  ResultsBackButtonComponent as BaseComponent
} from '../../../../../app/shared/results-back-button/results-back-button.component';
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-results-back-button',
  // styleUrls: ['./results-back-button.component.scss'],
  styleUrls: ['../../../../../app/shared/results-back-button/results-back-button.component.scss'],
  //templateUrl: './results-back-button.component.html',
  templateUrl: '../../../../../app/shared/results-back-button/results-back-button.component.html',
  standalone: true,
  imports: [AsyncPipe]
})
export class ResultsBackButtonComponent extends BaseComponent {}
