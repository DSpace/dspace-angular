import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractBrowseElementsComponent } from '../abstract-browse-elements.component';

@Component({
  selector: 'ds-default-browse-elements',
  templateUrl: './default-browse-elements.component.html',
  styleUrls: ['./default-browse-elements.component.scss']
})
export class DefaultBrowseElementsComponent extends AbstractBrowseElementsComponent implements OnInit, OnChanges {

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics = this.appConfig.browseBy.showMetrics;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails = this.appConfig.browseBy.showThumbnails;

  @Input() showLabel: boolean;

  protected followThumbnailLink = this.appConfig.browseBy.showThumbnails;
}
