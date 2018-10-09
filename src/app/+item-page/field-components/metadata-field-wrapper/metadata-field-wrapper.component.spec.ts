import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { MetadataFieldWrapperComponent } from './metadata-field-wrapper.component';

@Component({
    selector: 'ds-component-with-content',
    template: '<ds-metadata-field-wrapper [label]="\'test label\'">\n' +
      '    <div class="my content">\n' +
      '    </div>\n' +
      '</ds-metadata-field-wrapper>'
})
class ContentComponent {}

fdescribe('MetadataFieldWrapperComponent', () => {
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

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should not show a label when there is no content', () => {
    component.label = 'test label';
    fixture.detectChanges();
    const debugLabel = fixture.debugElement.query(By.css(labelSelector));
    expect(debugLabel).toBeNull();
  });

  it('should show a label when there is content', () => {
    const parentFixture = TestBed.createComponent(ContentComponent);
    parentFixture.detectChanges();
    const parentComponent = parentFixture.componentInstance;
    const parentNative = parentFixture.nativeElement;
    const nativeLabel = parentNative.querySelector(labelSelector);
    expect(nativeLabel.textContent).toContain('test label');
  });

});
