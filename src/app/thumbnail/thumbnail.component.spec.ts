import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bitstream } from '../core/shared/bitstream.model';
import { SafeUrlPipe } from '../shared/utils/safe-url-pipe';

import { ThumbnailComponent } from './thumbnail.component';

// tslint:disable-next-line:pipe-prefix
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(key: string): string {
    return 'TRANSLATED ' + key;
  }
}

describe('ThumbnailComponent', () => {
  let comp: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailComponent, SafeUrlPipe, MockTranslatePipe],
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
    it('should include the alt text', () => {
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
      expect(image.getAttribute('alt')).toBe('TRANSLATED ' + comp.alt);
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
      it('should include the alt text', () => {
        comp.src = 'http://bit.stream';
        comp.defaultImage = 'http://default.img';
        comp.errorHandler();
        fixture.detectChanges();
        const image: HTMLElement = de.query(By.css('img')).nativeElement;
        expect(image.getAttribute('alt')).toBe('TRANSLATED ' + comp.alt);
      });
    });
    describe('and there is no default image', () => {
      it('should display the placeholder', () => {
        comp.src = 'http://default.img';
        comp.errorHandler();
        expect(comp.src).toBe(null);

        fixture.detectChanges();
        const placeholder = fixture.debugElement.query(By.css('div.thumbnail-placeholder')).nativeElement;
        expect(placeholder.innerHTML).toBe('TRANSLATED ' + comp.placeholder);
      });
    });
  });
});
