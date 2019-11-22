import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataFieldWrapperComponent } from './metadata-field-wrapper.component';

/* tslint:disable:max-classes-per-file */
@Component({
    selector: 'ds-component-without-content',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '</ds-metadata-field-wrapper>'
})
class NoContentComponent {}

@Component({
    selector: 'ds-component-with-empty-spans',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '    <span></span>\n' +
      '    <span></span>\n' +
      '</ds-metadata-field-wrapper>'
})
class SpanContentComponent {}

@Component({
    selector: 'ds-component-with-text',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '    <span>The quick brown fox jumps over the lazy dog</span>\n' +
      '</ds-metadata-field-wrapper>'
})
class TextContentComponent {}

@Component({
    selector: 'ds-component-with-image',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '    <img src="https://some/image.png" alt="an alt text">\n' +
      '</ds-metadata-field-wrapper>'
})
class ImgContentComponent {}
/* tslint:enable:max-classes-per-file */

describe('MetadataFieldWrapperComponent', () => {
  let component: MetadataFieldWrapperComponent;
  let fixture: ComponentFixture<MetadataFieldWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataFieldWrapperComponent, NoContentComponent, SpanContentComponent, TextContentComponent, ImgContentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldWrapperComponent);
    component = fixture.componentInstance;
  });

  const wrapperSelector = '.simple-view-element';

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should not show the component when there is no content', () => {
    const parentFixture = TestBed.createComponent(NoContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    expect(nativeWrapper.classList.contains('d-none')).toBe(true);
  });

  it('should not show the component when there is DOM content but not text or an image', () => {
    const parentFixture = TestBed.createComponent(SpanContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    expect(nativeWrapper.classList.contains('d-none')).toBe(true);
  });

  it('should show the component when there is text content', () => {
    const parentFixture = TestBed.createComponent(TextContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    parentFixture.detectChanges();
    expect(nativeWrapper.classList.contains('d-none')).toBe(false);
  });

  it('should show the component when there is img content', () => {
    const parentFixture = TestBed.createComponent(ImgContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    parentFixture.detectChanges();
    expect(nativeWrapper.classList.contains('d-none')).toBe(false);
  });

});
