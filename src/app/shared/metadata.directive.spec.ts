import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { MetadataValue } from '../core/shared/metadata.models';
import { MetadataDirective } from './metadata.directive';

@Component({
  imports: [
    MetadataDirective,
  ],
  template: `
    <span [dsMetadata]="mv"></span>
  `,
})
class HostComponent {
  mv?: MetadataValue | null;
}

describe('MetadataDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let span: HTMLSpanElement;
  let sanitizer: DomSanitizer;

  function createMetadata(value?: string, language?: string): MetadataValue {
    return {
      uuid: '123',
      value: value,
      language: language,
      place: undefined,
      authority: undefined,
      confidence: undefined,
    } as MetadataValue;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
    span = fixture.nativeElement.querySelector('span');
  });

  it('is empty and has no lang by default', () => {
    expect(span.innerHTML).toBe('');
    expect(span.hasAttribute('lang')).toBeFalse();
  });

  it('renders value and lang when metadata provided', () => {
    host.mv = createMetadata('Hello', 'en');
    fixture.detectChanges();
    expect(span.innerHTML).toBe('Hello');
    expect(span.getAttribute('lang')).toBe('en');
  });

  it('updates value and lang when metadata changes', () => {
    host.mv = createMetadata('First', 'en');
    fixture.detectChanges();
    host.mv = createMetadata('Deuxième', 'fr');
    fixture.detectChanges();
    expect(span.innerHTML).toBe('Deuxième');
    expect(span.getAttribute('lang')).toBe('fr');
  });

  it('clears content and lang when metadata set to null', () => {
    host.mv = createMetadata('Hello', 'en');
    fixture.detectChanges();
    host.mv = null;
    fixture.detectChanges();
    expect(span.innerHTML).toBe('');
    expect(span.hasAttribute('lang')).toBeFalse();
  });

  it('removes lang attribute when language missing', () => {
    host.mv = createMetadata('Value', undefined);
    fixture.detectChanges();
    expect(span.innerHTML).toBe('Value');
    expect(span.hasAttribute('lang')).toBeFalse();
  });

  it('renders empty string when value is undefined', () => {
    host.mv = createMetadata(undefined, 'en');
    fixture.detectChanges();
    expect(span.innerHTML).toBe('');
    expect(span.getAttribute('lang')).toBe('en');
  });

  it('sets innerHTML allowing markup', () => {
    host.mv = createMetadata('<em>Italic</em>', 'en');
    fixture.detectChanges();
    expect(span.innerHTML.toLowerCase()).toBe('<em>italic</em>');
  });

  it('sanitizes the value before setting innerHTML', () => {
    const sanitizeSpy = spyOn(sanitizer, 'sanitize').and.callThrough();
    host.mv = createMetadata('<em>Italic</em>', 'en');
    fixture.detectChanges();
    expect(sanitizeSpy).toHaveBeenCalledWith(jasmine.any(Number), '<em>Italic</em>');
  });

  it('strips out script tags from the value (XSS protection)', () => {
    host.mv = createMetadata('<script>alert("XSS")</script>Safe text', 'en');
    fixture.detectChanges();
    expect(span.innerHTML).not.toContain('<script');
    expect(span.innerHTML).toContain('Safe text');
  });

  it('strips out inline event handlers from the value (XSS protection)', () => {
    host.mv = createMetadata('<img src="x" onerror="document.body.insertAdjacentHTML(\'afterbegin\',\'<h1>XSS!</h1>\')">', 'en');
    fixture.detectChanges();
    expect(span.innerHTML).not.toContain('onerror');
    expect(document.body.querySelector('h1')).toBeNull();
  });
});
