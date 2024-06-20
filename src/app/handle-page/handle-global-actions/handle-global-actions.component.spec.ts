import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandleGlobalActionsComponent } from './handle-global-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * The test class for testing the HandleGlobalActionsComponent.
 */
describe('HandleGlobalActionsComponent', () => {
  let component: HandleGlobalActionsComponent;
  let fixture: ComponentFixture<HandleGlobalActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ HandleGlobalActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleGlobalActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
