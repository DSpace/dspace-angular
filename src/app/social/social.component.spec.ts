import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SocialComponent} from './social.component';
import {DOCUMENT} from '@angular/common';
import {CookieService} from '../core/services/cookie.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {of as observableOf, ReplaySubject} from 'rxjs';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let document: Document;
  const cookieServiceMock = {
    getAll: () => {
      return {};
    }
  };
  const routeStub = {
    outlet: 'primary',
    data: observableOf({showSocialButtons: true}),
  };
  const routeStubWithNoSocialButtons = {
    outlet: 'primary',
    data: observableOf({showSocialButtons: false}),
  };
  const events = new ReplaySubject();
  events.next(new NavigationEnd(1, '', ''));
  const routerStub = {
    events: events.asObservable()
  };
  const cookieServiceMockWithAddThis = {
    getAll: () => {
      return {
        'klaro-anonymous': {
          'add-this': true
        }
      };
    }
  };
  describe('Social Component when no cookies defined', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SocialComponent],
        imports: [StoreModule.forRoot({})],
        providers: [{provide: CookieService, useValue: cookieServiceMock},
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Router, useValue: routerStub},
          Document]
      }).compileComponents();
      fixture = TestBed.createComponent(SocialComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      fixture.detectChanges();
    });
    it('should create socialComponent', (done) => {
      expect(component).toBeTruthy();
      done();
    });
  });
  describe('Social Component when cookies defined for addThis and public page', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SocialComponent],
        imports: [StoreModule.forRoot({})],
        providers: [{provide: CookieService, useValue: cookieServiceMockWithAddThis},
          {provide: ActivatedRoute, useValue: routeStub},
          {provide: Router, useValue: routerStub},
          Document]
      }).compileComponents();
      fixture = TestBed.createComponent(SocialComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      spyOn(document.body, 'appendChild');
      spyOn(component, 'initializeScript');
      fixture.detectChanges();
    });
    it('should render the script', (done) => {
      expect(component.shareAccepted).toBeTrue();
      expect(component.initializeScript).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(component.appended).toBeTrue();
      done();
    });
  });
  describe('Social Component when cookies defined for addThis and private page', () => {
    beforeEach(async () => {

      await TestBed.configureTestingModule({
        declarations: [SocialComponent],
        imports: [StoreModule.forRoot({})],
        providers: [{provide: CookieService, useValue: cookieServiceMockWithAddThis},
          {provide: ActivatedRoute, useValue: routeStubWithNoSocialButtons},
          {provide: Router, useValue: routerStub},
          Document]
      }).compileComponents();
      fixture = TestBed.createComponent(SocialComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      spyOn(document.body, 'appendChild');
      spyOn(component, 'initializeScript');
      spyOn(component, 'showOrHideSocialButtons');
      fixture.detectChanges();
    });
    it('should remove the social buttons', (done) => {
      expect(component.shareAccepted).toBeTrue();
      expect(component.initializeScript).toHaveBeenCalled();
      expect(component.showOrHideSocialButtons).toHaveBeenCalledWith('none');
      done();
    });
  });
  describe('Social Component when cookies defined for addThis and undefined route data', () => {
    beforeEach(async () => {
      const routeStubWithSocialUndefined = {
        outlet: 'primary',
        data: observableOf({showSocialButtons: undefined}),
      };
      await TestBed.configureTestingModule({
        declarations: [SocialComponent],
        imports: [StoreModule.forRoot({})],
        providers: [{provide: CookieService, useValue: cookieServiceMockWithAddThis},
          {provide: ActivatedRoute, useValue: routeStubWithSocialUndefined},
          {provide: Router, useValue: routerStub},
          Document]
      }).compileComponents();
      fixture = TestBed.createComponent(SocialComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      const socialButtons = document.createElement('div');
      socialButtons.id = '#at-expanding-share-button';
      component.socialButtons = socialButtons;
      spyOn(document.body, 'appendChild');
      spyOn(document, 'querySelector').and.returnValue(socialButtons);
      spyOn(component, 'initializeScript');
      spyOn(component, 'showOrHideSocialButtons');
      fixture.detectChanges();
    });
    it('should remove the social buttons', (done) => {
      expect(component.socialButtons.style.display).toEqual('none');
      done();
    });
  });
});
