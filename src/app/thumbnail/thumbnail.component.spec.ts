import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThumbnailComponent } from './thumbnail.component';
import { Bitstream } from '../core/shared/bitstream.model';
import { SafeUrlPipe } from '../shared/utils/safe-url-pipe';

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

  it('should display image', () => {
    comp.thumbnail = new Bitstream();
    comp.thumbnail.content = 'test.url';
    fixture.detectChanges();
    const image: HTMLElement = de.query(By.css('img')).nativeElement;
    expect(image.getAttribute('src')).toBe(comp.thumbnail.content);
  });

  it('should display placeholder', () => {
    fixture.detectChanges();
    const image: HTMLElement = de.query(By.css('img')).nativeElement;
    expect(image.getAttribute('src')).toBe(comp.holderSource);
  });

});
