import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import { mockTruncatableService } from '../../mocks/mock-trucatable.service';
import { getMockTranslateService } from '../../mocks/translate.service.mock';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { TruncatableService } from '../truncatable.service';
import { TruncatablePartComponent } from './truncatable-part.component';

describe('TruncatablePartComponent', () => {
  let comp: TruncatablePartComponent;
  let fixture: ComponentFixture<TruncatablePartComponent>;
  let translateService: TranslateService;
  const id1 = '123';
  const id2 = '456';

  let truncatableService: any;

  beforeEach(waitForAsync(() => {
    translateService = getMockTranslateService();
    truncatableService = {
      isCollapsed: (id: string) => {
        if (id === id1) {
          return of(true);
        } else {
          return of(false);
        }
      },
    };
    void TestBed.configureTestingModule({
      imports: [NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }), TruncatablePartComponent],
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: TruncatableService, useValue: truncatableService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(TruncatablePartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TruncatablePartComponent);
    comp = fixture.componentInstance; // TruncatablePartComponent test instance
    fixture.detectChanges();
    truncatableService = (comp as any).filterService;
  });

  describe('When the item is collapsed', () => {
    beforeEach(() => {
      comp.id = id1;
      comp.minLines = 5;
      (comp as any).setLines();
      fixture.detectChanges();
    })
    ;

    it('lines should equal minlines', () => {
      expect((comp as any).lines).toEqual(comp.minLines.toString());
    });

    it('collapseButton should be hidden', () => {
      const a = fixture.debugElement.query(By.css('.collapseButton'));
      expect(a).toBeNull();
    });

    it('expandButton aria-expanded should be false', () => {
      const btn = fixture.debugElement.query(By.css('.expandButton'));
      expect(btn.nativeElement.getAttribute('aria-expanded')).toEqual('false');
    });
  });

  describe('When the item is expanded', () => {
    beforeEach(() => {
      comp.id = id2;
    })
    ;

    it('lines should equal maxlines when maxlines has a value', () => {
      comp.maxLines = 5;
      (comp as any).setLines();
      fixture.detectChanges();
      expect((comp as any).lines).toEqual(comp.maxLines.toString());
    });

    it('lines should equal \'none\' when maxlines has no value', () => {
      (comp as any).setLines();
      fixture.detectChanges();
      expect((comp as any).lines).toEqual('none');
    });

    it('collapseButton should be shown', () => {
      (comp as any).setLines();
      (comp as any).expandable = true;
      fixture.detectChanges();
      const a = fixture.debugElement.query(By.css('.collapseButton'));
      expect(a).not.toBeNull();
    });

    it('collapseButton aria-expanded should be true', () => {
      (comp as any).setLines();
      (comp as any).expandable = true;
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('.collapseButton'));
      expect(btn.nativeElement.getAttribute('aria-expanded')).toEqual('true');
    });
  });
});

describe('TruncatablePartComponent', () => {
  let comp: TruncatablePartComponent;
  let fixture: ComponentFixture<TruncatablePartComponent>;
  let translateService: TranslateService;
  const identifier = '1234567890';
  let truncatableService;
  beforeEach(waitForAsync(() => {
    translateService = getMockTranslateService();
    void TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        TruncatablePartComponent,
      ],
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: TruncatableService, useValue: mockTruncatableService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(TruncatablePartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruncatablePartComponent);
    comp = fixture.componentInstance; // TruncatablePartComponent test instance
    comp.id = identifier;
    fixture.detectChanges();
    truncatableService = (comp as any).service;
  });

  describe('When toggle is called', () => {
    beforeEach(() => {
      spyOn(truncatableService, 'toggle');
      comp.toggle();
    });

    it('should call toggle on the TruncatableService', () => {
      expect(truncatableService.toggle).toHaveBeenCalledWith(identifier);
    });
  });

});
