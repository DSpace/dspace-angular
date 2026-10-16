import {
  Component,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RoundedDynamicLayoutMatrixDirective } from './rounded-dynamic-layout-matrix.directive';

@Component({
  template: `
    <div class="container">
      <div class="box first" dsRoundedDynamicLayoutMatrix></div>
      <div class="box middle" [style]="middleStyle" dsRoundedDynamicLayoutMatrix></div>
      <div class="box last" dsRoundedDynamicLayoutMatrix></div>
    </div>
  `,
  imports: [
    RoundedDynamicLayoutMatrixDirective,
  ],
})
class TestComponent {
  middleStyle = '';
}

describe('RoundedDynamicLayoutMatrixDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  const classesOf = (selector: string): DOMTokenList =>
    (fixture.debugElement.query(By.css(selector)).nativeElement as HTMLElement).classList;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, RoundedDynamicLayoutMatrixDirective],
    }).createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  describe('when boxes are connected (no margins between them)', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should round the top of the first box only', () => {
      expect(classesOf('.first')).toContain('layout-rounded-top');
      expect(classesOf('.middle')).not.toContain('layout-rounded-top');
      expect(classesOf('.last')).not.toContain('layout-rounded-top');
    });

    it('should round the bottom of the last box only', () => {
      expect(classesOf('.first')).not.toContain('layout-rounded-bottom');
      expect(classesOf('.middle')).not.toContain('layout-rounded-bottom');
      expect(classesOf('.last')).toContain('layout-rounded-bottom');
    });

    it('should mark every box that has a following connected box as connected-bottom', () => {
      expect(classesOf('.first')).toContain('layout-connected-bottom');
      expect(classesOf('.middle')).toContain('layout-connected-bottom');
      expect(classesOf('.last')).not.toContain('layout-connected-bottom');
    });
  });

  describe('when the middle box is separated from its neighbours by margins', () => {
    beforeEach(() => {
      component.middleStyle = 'margin-top: 16px; margin-bottom: 16px;';
      fixture.detectChanges();
    });

    it('should round the bottom of the first box because the next sibling has a top margin', () => {
      expect(classesOf('.first')).toContain('layout-rounded-top');
      expect(classesOf('.first')).toContain('layout-rounded-bottom');
      expect(classesOf('.first')).not.toContain('layout-connected-bottom');
    });

    it('should round both top and bottom of the separated middle box', () => {
      expect(classesOf('.middle')).toContain('layout-rounded-top');
      expect(classesOf('.middle')).toContain('layout-rounded-bottom');
      expect(classesOf('.middle')).not.toContain('layout-connected-bottom');
    });

    it('should round the top of the last box because the previous sibling has a bottom margin', () => {
      expect(classesOf('.last')).toContain('layout-rounded-top');
      expect(classesOf('.last')).toContain('layout-rounded-bottom');
    });
  });

  describe('when the first box renders no visible content', () => {
    beforeEach(() => {
      const first = fixture.debugElement.query(By.css('.first')).nativeElement as HTMLElement;
      first.style.display = 'none';
      fixture.detectChanges();
    });

    it('should round the top of the first *visible* box', () => {
      expect(classesOf('.middle')).toContain('layout-rounded-top');
    });
  });
});

describe('RoundedDynamicLayoutMatrixDirective (server-side rendering)', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent, RoundedDynamicLayoutMatrixDirective],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).createComponent(TestComponent);

    fixture.debugElement.queryAll(By.css('.box')).forEach((de) => {
      const el = de.nativeElement as HTMLElement;
      (el as any).getClientRects = undefined;
    });
  });

  it('should not run the geometry logic nor throw during server-side rendering', () => {
    expect(() => fixture.detectChanges()).not.toThrow();

    const first = fixture.debugElement.query(By.css('.first')).nativeElement as HTMLElement;
    expect(first.classList).not.toContain('layout-rounded-top');
    expect(first.classList).not.toContain('layout-rounded-bottom');
    expect(first.classList).not.toContain('layout-connected-bottom');
  });
});
