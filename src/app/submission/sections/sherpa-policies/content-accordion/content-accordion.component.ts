import { TitleCasePipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { PermittedVersions } from '@dspace/core/submission/models/sherpa-policies-details.model';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents a section that contains the inner accordions for the publisher policy versions.
 */
@Component({
  selector: 'ds-content-accordion',
  templateUrl: './content-accordion.component.html',
  styleUrls: ['./content-accordion.component.scss'],
  imports: [
    NgbCollapseModule,
    TitleCasePipe,
    TranslateModule,
  ],
  standalone: true,
})
export class ContentAccordionComponent {
  /**
   * PermittedVersions to show information from
   */
  @Input() version: PermittedVersions;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;
}
