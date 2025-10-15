import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { MetadataValue } from '../core/shared/metadata.models';
import { MetadataDirective } from './metadata.directive';

@Component({
  standalone: true,
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

  function createMetadata(value?: string, language?: string): MetadataValue {
    return { uuid: '123', value: value as any, language: language as any, place: undefined as any, authority: undefined as any, confidence: undefined as any } as MetadataValue;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
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
    host.mv = createMetadata('Value', undefined as any);
    fixture.detectChanges();
    expect(span.innerHTML).toBe('Value');
    expect(span.hasAttribute('lang')).toBeFalse();
  });

  it('renders empty string when value is undefined', () => {
    host.mv = createMetadata(undefined as any, 'en');
    fixture.detectChanges();
    expect(span.innerHTML).toBe('');
    expect(span.getAttribute('lang')).toBe('en');
  });

  it('sets innerHTML allowing markup', () => {
    host.mv = createMetadata('<em>Italic</em>', 'en');
    fixture.detectChanges();
    expect(span.innerHTML.toLowerCase()).toBe('<em>italic</em>');
  });
});
