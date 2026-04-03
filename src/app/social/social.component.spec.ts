import { DOCUMENT } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';

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

  it('should embed social bar inside footer when social is enabled', (done) => {
    const doc = TestBed.inject(DOCUMENT);
    const footer = doc.createElement('footer');
    doc.body.appendChild(footer);

    (component as any).socialService = {
      enabled: true,
      configuration: {
        buttons: [],
        showPlusButton: false,
        showCounters: false,
        title: '',
      },
      initializeAddToAnyScript: () => {},
      showOnCurrentRoute$: null,
    };

    component.ngAfterViewInit();

    setTimeout(() => {
      const bar = doc.getElementById('dspace-a2a');
      expect(footer.contains(bar)).toBeTrue();
      expect(bar.style.position).toBe('relative');
      expect(bar.style.opacity).toBe('1');
      expect(bar.style.pointerEvents).toBe('auto');
      doc.body.removeChild(footer);
      done();
    }, 1100);
  });

  it('should not move bar if social is disabled', (done) => {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);

    (component as any).socialService = { enabled: false };
    component.ngAfterViewInit();

    setTimeout(() => {
      const bar = document.getElementById('dspace-a2a');
      expect(bar).toBeNull(); // no se mueve ni se modifica
      document.body.removeChild(footer);
      done();
    }, 1100);
  });

  it('should not move bar if platform is not browser', (done) => {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);

    (component as any).platformId = 'server'; // simula server
    (component as any).socialService = { enabled: true };
    component.ngAfterViewInit();

    setTimeout(() => {
      const bar = document.getElementById('dspace-a2a');
      expect(bar).toBeNull(); // no se mueve ni se modifica
      document.body.removeChild(footer);
      done();
    }, 1100);
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

  it('should toggle d-none class based on showOnCurrentRoute$', (done) => {
    const doc = TestBed.inject(DOCUMENT);
    const footer = doc.createElement('footer');
    doc.body.appendChild(footer);

    const showOnCurrentRouteMock = {
      subscribe: (cb: (value: boolean) => void) => {
        cb(false);
        setTimeout(() => cb(true), 50);
        return { unsubscribe: () => {} };
      },
    };

    (component as any).socialService = {
      enabled: true,
      configuration: {
        buttons: [],
        showPlusButton: false,
        showCounters: false,
        title: '',
      },
      initializeAddToAnyScript: () => {},
      showOnCurrentRoute$: showOnCurrentRouteMock,
    };

    fixture.detectChanges();

    const bar = doc.createElement('div');
    bar.id = 'dspace-a2a';
    bar.classList.add('a2a_kit');
    doc.body.appendChild(bar);

    component.ngAfterViewInit();

    setTimeout(() => {
      expect(bar.classList.contains('d-none')).toBeTrue();

      setTimeout(() => {
        expect(bar.classList.contains('d-none')).toBeFalse();
        doc.body.removeChild(bar);
        doc.body.removeChild(footer);
        done();
      }, 60);
    }, 10);
  });

});
