import { NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-metadata-field-wrapper',
  styleUrls: ['./metadata-field-wrapper.component.scss'],
  templateUrl: './metadata-field-wrapper.component.html',
  standalone: true,
  imports: [NgIf],
})
export class MetadataFieldWrapperComponent {

  /**
   * The label (title) for the content
   */
  @Input() label: string;
  @ViewChild('content', { static: true }) contentElementRef: ElementRef;

  @Input() hideIfNoTextContent = true;

  get hasNoContent(): boolean{
    return this.contentElementRef.nativeElement.textContent.trim().length === 0
    && this.contentElementRef.nativeElement.querySelector('img') === null;
  }
}
