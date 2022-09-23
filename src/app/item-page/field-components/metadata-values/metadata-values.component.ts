import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { environment } from '../../../../environments/environment';

/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component.
 * It puts the given 'separator' between each two values.
 */
@Component({
  selector: 'ds-metadata-values',
  styleUrls: ['./metadata-values.component.scss'],
  templateUrl: './metadata-values.component.html'
})
export class MetadataValuesComponent implements OnChanges {

  /**
   * The metadata values to display
   */
  @Input() mdValues: MetadataValue[];

  /**
   * The seperator used to split the metadata values (can contain HTML)
   */
  @Input() separator: string;

  /**
   * The label for this iteration of metadata values
   */
  @Input() label: string;

  /**
   * Whether this metadata should be rendered with markdown.
   */
  @Input() enableMarkdown = false;

  /**
   * This variable will be true if this metadata should be rendered with markdown, and if markdown is enabled in the
   * environment config.
   */
  renderMarkdown = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.renderMarkdown = !!environment.enableMarkdown && this.enableMarkdown;
  }
}
