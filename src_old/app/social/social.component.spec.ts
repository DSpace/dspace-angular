import { DOCUMENT } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { SocialComponent } from './social.component';
import { SocialService } from './social.service';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  const socialServiceStub = {};
  const activatedRouteStub = {} as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), SocialComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SocialService, useValue: socialServiceStub },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create socialComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties from socialService configuration on ngOnInit', () => {
    const config = {
      buttons: ['facebook', 'twitter'],
      showPlusButton: true,
      showCounters: true,
      title: 'Test Title',
    };

    (component as any).socialService = {
      enabled: true,
      configuration: config,
      initializeAddToAnyScript: () => {},
      showOnCurrentRoute$: null,
    };

    component.ngOnInit();

    expect(component.buttonList).toEqual(config.buttons);
    expect(component.showPlusButton).toBeTrue();
    expect(component.showCounters).toBeTrue();
    expect(component.title).toBe('Test Title');
  });

  describe('toggle d-none', () => {
    let toggleFixture: ComponentFixture<SocialComponent>;
    let showOnCurrentRoute$: BehaviorSubject<boolean>;

    beforeEach(async () => {
      showOnCurrentRoute$ = new BehaviorSubject<boolean>(false);

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({}), SocialComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          {
            provide: SocialService,
            useValue: {
              enabled: true,
              configuration: { buttons: [], showPlusButton: false, showCounters: false, title: '' },
              initializeAddToAnyScript: () => {},
              showOnCurrentRoute$: showOnCurrentRoute$,
            },
          },
        ],
      }).compileComponents();

      toggleFixture = TestBed.createComponent(SocialComponent);
      toggleFixture.detectChanges();
    });

    it('should toggle d-none class based on showOnCurrentRoute$', fakeAsync(() => {
      const doc = TestBed.inject(DOCUMENT);

      const bar = doc.getElementById('dspace-a2a');
      expect(bar).toBeTruthy();
      expect(bar.classList.contains('d-none')).toBeTrue();

      showOnCurrentRoute$.next(true);
      tick();
      toggleFixture.detectChanges();

      expect(bar.classList.contains('d-none')).toBeFalse();
    }));
  });

});
