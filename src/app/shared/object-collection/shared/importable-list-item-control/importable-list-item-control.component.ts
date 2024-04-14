import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { ListableObject } from '../listable-object.model';

@Component({
  selector: 'ds-importable-list-item-control',
  templateUrl: './importable-list-item-control.component.html',
  standalone: true,
  imports: [TranslateModule, FontAwesomeModule],
})
/**
 * Component adding an import button to a list item
 */
export class ImportableListItemControlComponent {
  protected readonly faCloudDownloadAlt = faCloudDownloadAlt;

  /**
   * The item or metadata to determine the component for
   */
  @Input() object: ListableObject;

  /**
   * Extra configuration for the import button
   */
  @Input() importConfig: { buttonLabel: string };

  /**
   * Output the object to import
   */
  @Output() importObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
}
