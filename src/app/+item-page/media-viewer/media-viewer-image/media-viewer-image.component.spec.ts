import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MediaViewerImageComponent } from './media-viewer-image.component';

describe('MediaViewerImageComponent', () => {
  let component: MediaViewerImageComponent;
  let fixture: ComponentFixture<MediaViewerImageComponent>;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaViewerImageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerImageComponent);
    component = fixture.componentInstance;
    component.galleryOptions = [
      {
        image: true,
        imageSize: 'contain',
        thumbnails: false,
        imageArrows: false,
        width: '340px',
        height: '279px',
      },
    ];
    debugElement = fixture.debugElement.query(By.css('ngx-gallery'));
    htmlElement = debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe;
});
