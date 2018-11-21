import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { MetadataFieldWrapperComponent } from './metadata-field-wrapper.component';

@Component({
    selector: 'ds-component-with-content',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '    <div class="my-content">\n' +
      '    <span></span>\n' +
      '    </div>\n' +
      '</ds-metadata-field-wrapper>'
})
class ContentComponent {}

describe('MetadataFieldWrapperComponent', () => {
  let component: MetadataFieldWrapperComponent;
  let fixture: ComponentFixture<MetadataFieldWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataFieldWrapperComponent, ContentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldWrapperComponent);
    component = fixture.componentInstance;
  });

  const wrapperSelector = '.simple-view-element';
  const labelSelector = '.simple-view-element-header';
  const contentSelector = '.my-content';

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should not show the component when there is no content', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const parentNative = fixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    expect(nativeWrapper.classList.contains('d-none')).toBe(true);
  });

  it('should not show the component when there is DOM content but no text', () => {
    const parentFixture = TestBed.createComponent(ContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    expect(nativeWrapper.classList.contains('d-none')).toBe(true);
  });

  it('should show the component when there is text content', () => {
    const parentFixture = TestBed.createComponent(ContentComponent);
    parentFixture.detectChanges();
    const parentNative = parentFixture.nativeElement;
    const nativeContent = parentNative.querySelector(contentSelector);
    nativeContent.textContent = 'lorem ipsum';
    const nativeWrapper = parentNative.querySelector(wrapperSelector);
    parentFixture.detectChanges();
    expect(nativeWrapper.classList.contains('d-none')).toBe(false);
  });

});
