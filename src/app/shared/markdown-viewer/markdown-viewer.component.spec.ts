import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewerComponent } from './markdown-viewer.component';

import { SharedModule } from '../shared.module';

describe('DsMarkdownViewerComponent', () => {
  let component: MarkdownViewerComponent;
  let fixture: ComponentFixture<MarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkdownViewerComponent ],
      imports: [ SharedModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
