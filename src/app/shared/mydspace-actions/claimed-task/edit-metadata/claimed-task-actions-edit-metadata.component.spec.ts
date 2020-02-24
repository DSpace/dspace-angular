import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ClaimedTaskActionsEditMetadataComponent } from './claimed-task-actions-approve.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';

let component: ClaimedTaskActionsEditMetadataComponent;
let fixture: ComponentFixture<ClaimedTaskActionsEditMetadataComponent>;

describe('ClaimedTaskActionsApproveComponent', () => {
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
      declarations: [ClaimedTaskActionsEditMetadataComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsEditMetadataComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsEditMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should display approve button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-success'));

    expect(btn).toBeDefined();
  });

  it('should display spin icon when approve is pending', () => {
    component.processingApprove = true;
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-success .fa-spin'));

    expect(span).toBeDefined();
  });

  it('should emit approve event', () => {
    spyOn(component.approve, 'emit');

    component.confirmApprove();
    fixture.detectChanges();

    expect(component.approve.emit).toHaveBeenCalled();
  });

});
