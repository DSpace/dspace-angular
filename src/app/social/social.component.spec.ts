import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SocialComponent} from './social.component';
import {DOCUMENT} from '@angular/common';
import {SimpleChanges} from '@angular/core';


describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let document: Document;
  let socialButtons: HTMLElement;
  let change: SimpleChanges;
  // tslint:disable-next-line:prefer-const
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialComponent],
      providers: [
        Document]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    document = TestBed.inject(DOCUMENT);
    change = Object.assign({
      showSocialButtons: {
        currentValue: true
      }
    });
    fixture.detectChanges();
  });
  it('should create socialComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should call append child of document body', () => {
    spyOn(document.body, 'appendChild');
    component.ngOnChanges(change);
    expect(document.body.appendChild).toHaveBeenCalled();
  });
  beforeEach(() => {
    socialButtons = document.createElement('div');
    socialButtons.id = '#at-expanding-share-button';
    fixture.detectChanges();
  });
  it('should call append child of renderer', () => {
    component.appended = true;
    component.socialButtons = socialButtons;
    component.ngOnChanges(change);
    expect(socialButtons.style.display).toEqual('block');
  });
  it('should call querySelector', () => {
    component.appended = false;
    component.socialButtons = socialButtons;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=123';
    component.script = script;
    change = Object.assign({
      showSocialButtons: {
        currentValue: false
      }
    });
    component.ngOnChanges(change);
    expect(socialButtons.style.display).toEqual('none');
  });
});
