import {
  Directive,
  ElementRef,
  inject,
  Input,
  Renderer2,
} from '@angular/core';

import { MetadataValue } from '../core/shared/metadata.models';

@Directive({
  selector: '[dsMetadata]',
  standalone: true,
})
export class MetadataDirective {
  private _metadataValue?: MetadataValue;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  /**
   * Accepts a MetadataValue. Sets the host element's innerHTML to the metadata value and the lang attribute to the metadata language.
   */
  @Input() set dsMetadata(value: MetadataValue | null | undefined) {
    this._metadataValue = value ?? undefined;
    this.updateHost();
  }

  private updateHost(): void {
    if (this._metadataValue) {
      const val = this._metadataValue.value ?? '';
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', val);
      if (this._metadataValue.language) {
        this.renderer.setAttribute(this.el.nativeElement, 'lang', this._metadataValue.language);
      } else {
        this.renderer.removeAttribute(this.el.nativeElement, 'lang');
      }
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
      this.renderer.removeAttribute(this.el.nativeElement, 'lang');
    }
  }
}

