import { Observable, of } from 'rxjs';
import { TextRowSection } from './../../../core/layout/models/section.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ds-text-section',
  templateUrl: './text-section.component.html'
})
export class TextSectionComponent {

  @Input()
  sectionId: string;

  @Input()
  textRowSection: TextRowSection;

}
