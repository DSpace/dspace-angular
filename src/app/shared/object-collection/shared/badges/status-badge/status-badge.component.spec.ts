import { Item } from '../../../../../core/shared/item.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StatusBadgeComponent } from './status-badge.component';

let comp: StatusBadgeComponent;
let fixture: ComponentFixture<StatusBadgeComponent>;

let withdrawnItem = Object.assign(new Item(), { isWithdrawn: true });
let notWithdrawnItem = Object.assign(new Item(), { isWithdrawn: false });
let privateItem = Object.assign(new Item(), { isDiscoverable: false });
let notPrivateItem = Object.assign(new Item(), { isDiscoverable: true });

describe('ItemStatusBadgeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), StatusBadgeComponent, TruncatePipe],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(StatusBadgeComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
    init();
  }));

  function init() {
    withdrawnItem = Object.assign(new Item(), { isWithdrawn: true });
    notWithdrawnItem = Object.assign(new Item(), { isWithdrawn: false });
    privateItem = Object.assign(new Item(), { isDiscoverable: false });
    notPrivateItem = Object.assign(new Item(), { isDiscoverable: true });
  }
  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(StatusBadgeComponent);
    comp = fixture.componentInstance;
  }));


  describe('when the item is not withdrawn', () => {
    beforeEach(() => {
      comp.object = notWithdrawnItem;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show the withdrawn badge', () => {
      const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
      expect(badge).toBeNull();
    });
  });

  describe('when the item is withdrawn', () => {
    beforeEach(() => {
      comp.object = withdrawnItem;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the withdrawn badge', () => {
      const badge = fixture.debugElement.query(By.css('div.withdrawn-badge'));
      expect(badge).not.toBeNull();
    });
  });

  describe('when the item is not private', () => {
    beforeEach(() => {
      comp.object = notPrivateItem;
      comp.ngOnInit();
      fixture.detectChanges();
    });
    it('should not show the private badge', () => {
      const badge = fixture.debugElement.query(By.css('div.private-badge'));
      expect(badge).toBeNull();
    });
  });

  describe('when the item is private', () => {
    beforeEach(() => {
      comp.object = privateItem;
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the private badge', () => {
      const badge = fixture.debugElement.query(By.css('div.private-badge'));
      expect(badge).not.toBeNull();
    });
  });
});
