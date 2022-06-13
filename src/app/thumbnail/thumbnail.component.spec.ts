import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bitstream } from '../core/shared/bitstream.model';
import { SafeUrlPipe } from '../shared/utils/safe-url-pipe';

import { ThumbnailComponent } from './thumbnail.component';
import { RemoteData } from '../core/data/remote-data';
import {
  createFailedRemoteDataObject, createPendingRemoteDataObject, createSuccessfulRemoteDataObject,
} from '../shared/remote-data.utils';

// eslint-disable-next-line @angular-eslint/pipe-prefix
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
    comp = fixture.componentInstance; // ThumbnailComponent test instance
    de = fixture.debugElement.query(By.css('div.thumbnail'));
    el = de.nativeElement;
  });

  const withoutThumbnail = () => {
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
        comp.ngOnChanges();
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

        comp.ngOnChanges();
        fixture.detectChanges();
        const placeholder = fixture.debugElement.query(By.css('div.thumbnail-placeholder')).nativeElement;
        expect(placeholder.innerHTML).toBe('TRANSLATED ' + comp.placeholder);
      });
    });
  };

  describe('with thumbnail as Bitstream', () => {
    let thumbnail: Bitstream;
    beforeEach(() => {
      thumbnail = new Bitstream();
      thumbnail._links = {
        self: { href: 'self.url' },
        bundle: { href: 'bundle.url' },
        format: { href: 'format.url' },
        content: { href: 'content.url' },
        thumbnail: undefined,
      };
    });

    it('should display an image', () => {
      comp.thumbnail = thumbnail;
      comp.ngOnChanges();
      fixture.detectChanges();
      const image: HTMLElement = de.query(By.css('img')).nativeElement;
      expect(image.getAttribute('src')).toBe(comp.thumbnail._links.content.href);
    });

    it('should include the alt text', () => {
      comp.thumbnail = thumbnail;
      comp.ngOnChanges();
      fixture.detectChanges();
      const image: HTMLElement = de.query(By.css('img')).nativeElement;
      expect(image.getAttribute('alt')).toBe('TRANSLATED ' + comp.alt);
    });

    describe('when there is no thumbnail', () => {
      withoutThumbnail();
    });
  });

  describe('with thumbnail as RemoteData<Bitstream>', () => {
    let thumbnail: RemoteData<Bitstream>;

    describe('while loading', () => {
      beforeEach(() => {
        thumbnail = createPendingRemoteDataObject();
      });

      it('should show a loading animation', () => {
        comp.thumbnail = thumbnail;
        comp.ngOnChanges();
        fixture.detectChanges();
        expect(de.query(By.css('ds-loading'))).toBeTruthy();
      });
    });

    describe('when there is a thumbnail', () => {
      beforeEach(() => {
        const bitstream = new Bitstream();
        bitstream._links = {
          self: { href: 'self.url' },
          bundle: { href: 'bundle.url' },
          format: { href: 'format.url' },
          content: { href: 'content.url' },
          thumbnail: undefined,
        };
        thumbnail = createSuccessfulRemoteDataObject(bitstream);
      });

      it('should display an image', () => {
        comp.thumbnail = thumbnail;
        comp.ngOnChanges();
        fixture.detectChanges();
        const image: HTMLElement = de.query(By.css('img')).nativeElement;
        expect(image.getAttribute('src')).toBe(comp.thumbnail.payload._links.content.href);
      });

      it('should display the alt text', () => {
        comp.thumbnail = thumbnail;
        comp.ngOnChanges();
        fixture.detectChanges();
        const image: HTMLElement = de.query(By.css('img')).nativeElement;
        expect(image.getAttribute('alt')).toBe('TRANSLATED ' + comp.alt);
      });
    });

    describe('when there is no thumbnail', () => {
      beforeEach(() => {
        thumbnail = createFailedRemoteDataObject();
      });

      withoutThumbnail();
    });
  });
});
