import {
  NgForOf,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCertificate,
  faChevronDown,
  faChevronUp,
  faExclamationCircle,
  faFolderOpen,
  faHourglassHalf,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { PermittedVersions } from '../../../../core/submission/models/sherpa-policies-details.model';

/**
 * This component represents a section that contains the inner accordions for the publisher policy versions.
 */
@Component({
  selector: 'ds-content-accordion',
  templateUrl: './content-accordion.component.html',
  styleUrls: ['./content-accordion.component.scss'],
  imports: [
    NgForOf,
    TranslateModule,
    NgIf,
    NgbCollapseModule,
    TitleCasePipe,
    FontAwesomeModule,
  ],
  standalone: true,
})
export class ContentAccordionComponent {
  protected readonly faChevronUp = faChevronUp;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faHourglassHalf = faHourglassHalf;
  protected readonly faFolderOpen = faFolderOpen;
  protected readonly faCertificate = faCertificate;
  protected readonly faExclamationCircle = faExclamationCircle;
  protected readonly faTasks = faTasks;

  /**
   * PermittedVersions to show information from
   */
  @Input() version: PermittedVersions;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;
}
