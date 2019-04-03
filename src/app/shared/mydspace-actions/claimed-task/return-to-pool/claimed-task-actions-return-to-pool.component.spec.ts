import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ClaimedTaskActionsReturnToPoolComponent } from './claimed-task-actions-return-to-pool.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';

let component: ClaimedTaskActionsReturnToPoolComponent;
let fixture: ComponentFixture<ClaimedTaskActionsReturnToPoolComponent>;

describe('ClaimedTaskActionsReturnToPoolComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [ClaimedTaskActionsReturnToPoolComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsReturnToPoolComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsReturnToPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should display return to pool button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-secondary'));

    expect(btn).toBeDefined();
  });

  it('should display spin icon when return to pool action is pending', () => {
    component.processingReturnToPool = true;
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-secondary .fa-spin'));

    expect(span).toBeDefined();
  });

  it('should emit return to pool event', () => {
    spyOn(component.returnToPool, 'emit');

    component.confirmReturnToPool();
    fixture.detectChanges();

    expect(component.returnToPool.emit).toHaveBeenCalled();
  });

});
