import {
  Directive,
  ElementRef,
  inject,
  Input,
  Renderer2,
} from '@angular/core';

import { MetadataValue } from '../core/shared/metadata.models';
import { normalizeLanguageCode } from './utils/normalize-language-code-utils';

/**
 * A directive that sets the innerHTML and lang attribute of the host element
 * based on the provided `MetadataValue`.
 *
 * - The `innerHTML` is set to the `value` property of the `MetadataValue`.
 * - The `lang` attribute is set to the `language` property of the `MetadataValue`.
 * - If the `MetadataValue` is null or undefined, the `innerHTML` is cleared and the `lang` attribute is removed.
 */
@Directive({
  selector: '[dsMetadata]',
  standalone: true,
})
export class MetadataDirective {
  /**
   * Stores the current `MetadataValue` provided to the directive.
   */
  private _metadataValue?: MetadataValue;

  /**
   * Reference to the host DOM element.
   */
  private el = inject(ElementRef);

  /**
   * Angular Renderer2 instance for safely manipulating the DOM.
   */
  private renderer = inject(Renderer2);

  /**
   * Input property for the directive. Accepts a `MetadataValue` object.
   * When set, it updates the host element's `innerHTML` and `lang` attribute.
   *
   * @param value - The `MetadataValue` object containing the `value` and `language`.
   */
  @Input() set dsMetadata(value: MetadataValue | null | undefined) {
    this._metadataValue = value ?? undefined;
    this.updateHost();
  }

  /**
   * Updates the host element's `innerHTML` and `lang` attribute based on the current `MetadataValue`.
   * - If `MetadataValue` is provided:
   *   - Sets `innerHTML` to `MetadataValue.value` (or an empty string if `value` is null/undefined).
   *   - Sets the `lang` attribute to `MetadataValue.language` (or removes it if `language` is null/undefined).
   * - If `MetadataValue` is null/undefined:
   *   - Clears the `innerHTML`.
   *   - Removes the `lang` attribute.
   */
  private updateHost(): void {
    if (this._metadataValue) {
      const val = this._metadataValue.value ?? '';
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', val);
      if (this._metadataValue.language) {
        const normalizedLang = normalizeLanguageCode(this._metadataValue.language);
        this.renderer.setAttribute(this.el.nativeElement, 'lang', normalizedLang);
      } else {
        this.renderer.removeAttribute(this.el.nativeElement, 'lang');
      }
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '');
      this.renderer.removeAttribute(this.el.nativeElement, 'lang');
    }
  }
}
