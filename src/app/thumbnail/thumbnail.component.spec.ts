import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bitstream } from '../core/shared/bitstream.model';
import { SafeUrlPipe } from '../shared/utils/safe-url-pipe';

import { THUMBNAIL_PLACEHOLDER, ThumbnailComponent } from './thumbnail.component';

describe('ThumbnailComponent', () => {
  let comp: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailComponent, SafeUrlPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent);
    comp = fixture.componentInstance; // BannerComponent test instance
    de = fixture.debugElement.query(By.css('div.thumbnail'));
    el = de.nativeElement;
  });

  describe('when the thumbnail exists', () => {
    it('should display an image', () => {
      const thumbnail = new Bitstream();
      thumbnail._links = {
        self: { href: 'self.url' },
        bundle: { href: 'bundle.url' },
        format: { href: 'format.url' },
        content: { href: 'content.url' },
      };
      comp.thumbnail = thumbnail;
      fixture.detectChanges();
      const image: HTMLElement = de.query(By.css('img')).nativeElement;
      expect(image.getAttribute('src')).toBe(comp.thumbnail._links.content.href);
    });
  });
  describe(`when the thumbnail doesn't exist`, () => {
    describe('and there is a default image', () => {
      it('should display the default image', () => {
        comp.src = 'http://bit.stream';
        comp.defaultImage = 'http://default.img';
        comp.errorHandler();
        expect(comp.src).toBe(comp.defaultImage);
      });
    });
    describe('and there is no default image', () => {
      it('should display the placeholder', () => {
        comp.src = 'http://default.img';
        comp.defaultImage = 'http://default.img';
        comp.errorHandler();
        expect(comp.src).toBe(THUMBNAIL_PLACEHOLDER);
      })
    });
  });
});
