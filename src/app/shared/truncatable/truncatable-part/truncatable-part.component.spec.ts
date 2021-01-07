import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { TruncatablePartComponent } from './truncatable-part.component';
import { TruncatableService } from '../truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TruncatablePartComponent', () => {
  let comp: TruncatablePartComponent;
  let fixture: ComponentFixture<TruncatablePartComponent>;
  const id1 = '123';
  const id2 = '456';

  let truncatableService;
  const truncatableServiceStub: any = {
    isCollapsed: (id: string) => {
      if (id === id1) {
        return observableOf(true);
      } else {
        return observableOf(false);
      }
    }
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [TruncatablePartComponent],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TruncatablePartComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
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
  });
});
