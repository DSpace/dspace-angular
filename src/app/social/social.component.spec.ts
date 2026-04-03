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
    const bar = doc.createElement('div');
    bar.id = 'dspace-a2a';
    doc.body.appendChild(footer);
    doc.body.appendChild(bar);
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
      expect(footer.firstChild).toBe(bar);
      expect(bar.style.position).toBe('relative');
      expect(bar.style.opacity).toBe('1');
      expect(bar.style.pointerEvents).toBe('auto');
      doc.body.removeChild(footer);
      done();
    }, 1100);
  });

});
