import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsMarkdownViewerComponent } from './ds-markdown-viewer.component';

describe('DsMarkdownViewerComponent', () => {
  let component: DsMarkdownViewerComponent;
  let fixture: ComponentFixture<DsMarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsMarkdownViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsMarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
