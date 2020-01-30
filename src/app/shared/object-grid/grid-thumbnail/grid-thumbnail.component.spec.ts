import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { SafeUrlPipe } from '../../utils/safe-url-pipe';

import { GridThumbnailComponent } from './grid-thumbnail.component';

describe('GridThumbnailComponent', () => {
  let comp: GridThumbnailComponent;
  let fixture: ComponentFixture<GridThumbnailComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridThumbnailComponent, SafeUrlPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridThumbnailComponent);
    comp = fixture.componentInstance; // BannerComponent test instance
    de = fixture.debugElement.query(By.css('div.thumbnail'));
    el = de.nativeElement;
  });

  it('should display image', () => {
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

  it('should display placeholder', () => {
    const thumbnail = new Bitstream();
    comp.thumbnail = thumbnail;
    fixture.detectChanges();
    const image: HTMLElement = de.query(By.css('img')).nativeElement;
    expect(image.getAttribute('src')).toBe(comp.defaultImage);
  });

});
