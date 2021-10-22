import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SocialComponent} from './social.component';
import {DOCUMENT} from '@angular/common';
import {Renderer2, SimpleChanges} from '@angular/core';
import {Type} from 'ng-mocks';


describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let document: Document;

  // tslint:disable-next-line:prefer-const
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialComponent],
      providers: [Renderer2,
        Document]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    document = TestBed.inject(DOCUMENT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call append child of document body', () => {
    spyOn(document.body, 'appendChild');
    const change: SimpleChanges = Object.assign({
      showSocialButtons: {
        currentValue: true
      }
    });
    component.ngOnChanges(change);
    fixture.detectChanges();
    expect(document.body.appendChild).toHaveBeenCalled();
  });
  it('should call append child of renderer', () => {
    const renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    spyOn(renderer2, 'appendChild');
    component.appended = true;
    component.socialButtons = document.createElement('div');
    const change: SimpleChanges = Object.assign({
      showSocialButtons: {
        currentValue: true
      }
    });
    component.ngOnChanges(change);
    fixture.detectChanges();
    expect(renderer2.appendChild).toHaveBeenCalled();
  });
  it('should call querySelector', () => {
    component.script =  document.createElement('script');
    component.script.type = 'text/javascript';
    component.script.src = 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=123';
    component.appended = true;
    const socialButtons = document.createElement('div');
    socialButtons.id = '#at-expanding-share-button';
    spyOn(document, 'querySelector').and.returnValue(socialButtons);
    const change: SimpleChanges = Object.assign({
      showSocialButtons: {
        currentValue: false
      }
    });
    component.ngOnChanges(change);
    fixture.detectChanges();
    expect(document.querySelector).toHaveBeenCalledWith('#at-expanding-share-button');
  });
});
