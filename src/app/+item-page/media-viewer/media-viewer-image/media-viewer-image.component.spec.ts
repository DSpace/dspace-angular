import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

import { MediaViewerImageComponent } from './media-viewer-image.component';

describe('MediaViewerImageComponent', () => {
  let component: MediaViewerImageComponent;
  let fixture: ComponentFixture<MediaViewerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaViewerImageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerImageComponent);
    component = fixture.componentInstance;
    component.galleryOptions = [new NgxGalleryOptions({})];
    component.galleryImages = [
      new NgxGalleryImage({
        small: './assets/images/banner.jpg',
        medium: './assets/images/banner.jpg',
        big: './assets/images/banner.jpg',
      }),
      new NgxGalleryImage({
        small: './assets/images/dspace-logo.png',
        medium: './assets/images/2-medium.jpg',
        big: './assets/images/2-big.jpg',
      }),
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
