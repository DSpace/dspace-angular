import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialComponent } from './social.component';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs';
import { SocialService } from './social.service';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;
  let document: Document;
  const script = {} as any;

  const showSocialButtonsSubject = new Subject<boolean>();
  const socialServiceStub = {
    showSocialButtons: (activatedRoute) => showSocialButtonsSubject.asObservable(),
    initializeAddThisScript: (_document) => script,
    show: (_document) => null,
    hide: (_document) => null,
  };

  const activatedRouteStub = {} as ActivatedRoute;

  describe('Social Component when no cookies defined', () => {

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SocialComponent],
        imports: [StoreModule.forRoot({})],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: SocialService, useValue: socialServiceStub}
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(SocialComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT) as any;

      spyOn(socialServiceStub, 'showSocialButtons').and.callThrough();
      spyOn(socialServiceStub, 'show').and.callThrough();
      spyOn(socialServiceStub, 'initializeAddThisScript').and.callThrough();
      spyOn(socialServiceStub, 'hide').and.callThrough();

      fixture.detectChanges();
    });

    it('should create socialComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should subscribe to showSocialButtons with activatedRoute', () => {
      expect(socialServiceStub.showSocialButtons).toHaveBeenCalledWith(activatedRouteStub);
    });

    it('when showSocialButtons emit true should initialize the script and show social buttons', () => {

      showSocialButtonsSubject.next(true);

      expect(socialServiceStub.initializeAddThisScript).toHaveBeenCalledWith(document);
      expect(component.script).toEqual(script);
      expect(socialServiceStub.show).toHaveBeenCalledWith(document);
    });

    it('when showSocialButtons emit false should hide social buttons', () => {

      showSocialButtonsSubject.next(false);

      expect(socialServiceStub.hide).toHaveBeenCalledWith(document);
    });
  });

});
