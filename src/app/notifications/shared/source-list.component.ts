import { DatePipe } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
} from '@angular/core';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

export interface SourceObject {
  id: string;
  lastEvent?: string;
  total: number;
}

/**
 * Component to display the Quality Assurance source list.
 */
@Component({
  selector: 'ds-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    PaginationComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class SourceListComponent {

  /**
   * A boolean indicating whether the sources are in a loading state.
   */
  loading: InputSignal<boolean> = input<boolean>(false);

  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  paginationConfig: InputSignal<PaginationComponentOptions> = input<PaginationComponentOptions>();

  /**
   * A boolean indicating whether to show the last event column.
   */
  showLastEvent: InputSignal<boolean> = input<boolean>();

  /**
   * The source list.
   */
  sources: InputSignal<SourceObject[]|null> = input<SourceObject[]|null>();

  /**
   * The total number of Quality Assurance sources.
   */
  totalElements: InputSignal<number> = input<number>();

  /**
   * Event emitter for when a source is selected.
   * Emits the ID of the selected source.
   */
  sourceSelected = output<string>();

  /**
   * Event emitter for when the pagination changes.
   * Emits a string representation of the pagination change.
   */
  paginationChange = output<string>();

}
