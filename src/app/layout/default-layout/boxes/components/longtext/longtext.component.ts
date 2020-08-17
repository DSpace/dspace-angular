import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * This component renders the longtext metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'div[ds-longtext]',
  templateUrl: './longtext.component.html',
  styleUrls: ['./longtext.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LONGTEXT)
export class LongtextComponent extends RenderingTypeModel implements AfterViewInit {
  /**
   * This parameter defines the status of the component (collapsed/expanded)
   */
  collapsed = true;
  /**
   * This parameter defines if the component contains more text to show
   */
  collapsable = false;
  /**
   * Reference to html element that will contains the text to show
   */
  @ViewChild('textcontainer', { static: false }) textContainer: ElementRef;

  constructor(private translateService: TranslateService) {
    super();
  }

  ngAfterViewInit(): void {
    // Check if the content is in overflow
    this.collapsable = this.textContainer.nativeElement.scrollHeight > this.textContainer.nativeElement.clientHeight;
  }

  /**
   * Hide/Show more content if exists
   */
  toggle() {
    this.collapsed = !this.collapsed;
  }

  /**
   * Returns the label to show in button
   */
  get buttonText(): Observable<any> {
    let label = 'layout.field.longtext.button.less';
    if (this.collapsed) {
      label = 'layout.field.longtext.button.more';
    }
    return this.translateService.get(label);
  }
}
