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
  let document: Document;

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
    document = TestBed.inject(DOCUMENT) as any;
    fixture.detectChanges();
  });

  it('should create socialComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should embed social bar inside footer when social is enabled', fakeAsync(() => {
    const doc = TestBed.inject(DOCUMENT);
    const footer = doc.createElement('footer');
    doc.body.appendChild(footer);

    (component as any).socialService = {
      enabled: true,
      configuration: { buttons: [], showPlusButton: false, showCounters: false, title: '' },
      initializeAddToAnyScript: () => {},
      showOnCurrentRoute$: null,
    };

    component.ngAfterViewInit();
    tick(1100);

    const bar = doc.getElementById('dspace-a2a');
    expect(footer.contains(bar)).toBeTrue();
    expect(bar.style.position).toBe('relative');
    expect(bar.style.opacity).toBe('1');
    expect(bar.style.pointerEvents).toBe('auto');

    doc.body.removeChild(footer);
  }));

  it('should not move bar if social is disabled', fakeAsync(() => {
    const doc = TestBed.inject(DOCUMENT);
    const footer = doc.createElement('footer');
    doc.body.appendChild(footer);

    (component as any).socialService = { enabled: false };
    component.ngAfterViewInit();
    tick(1100);

    const bar = doc.getElementById('dspace-a2a');
    if (bar) {
      expect(footer.contains(bar)).toBeFalse();
      expect(bar.style.position).not.toBe('relative');
      expect(bar.style.opacity).not.toBe('1');
    } else {
      expect(bar).toBeNull();
    }

    doc.body.removeChild(footer);
  }));

  it('should not move bar if platform is not browser', fakeAsync(() => {
    const doc = TestBed.inject(DOCUMENT);
    const footer = doc.createElement('footer');
    doc.body.appendChild(footer);

    (component as any).platformId = 'server';
    (component as any).socialService = { enabled: true };
    component.ngAfterViewInit();
    tick(1100);

    const bar = doc.getElementById('dspace-a2a');
    if (bar) {
      expect(footer.contains(bar)).toBeFalse();
      expect(bar.style.position).not.toBe('relative');
      expect(bar.style.opacity).not.toBe('1');
    } else {
      expect(bar).toBeNull();
    }

    doc.body.removeChild(footer);
  }));

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
    let toggleComponent: SocialComponent;
    let showOnCurrentRoute$: BehaviorSubject<boolean>;

    beforeEach(async () => {
      showOnCurrentRoute$ = new BehaviorSubject<boolean>(false);

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
      toggleComponent = toggleFixture.componentInstance;
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
