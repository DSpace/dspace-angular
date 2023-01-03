import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdvancedClaimedTaskActionSelectReviewerComponent
} from './advanced-claimed-task-action-select-reviewer.component';

describe('AdvancedClaimedTaskActionsSelectReviewerComponent', () => {
  let component: AdvancedClaimedTaskActionSelectReviewerComponent;
  let fixture: ComponentFixture<AdvancedClaimedTaskActionSelectReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdvancedClaimedTaskActionSelectReviewerComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedClaimedTaskActionSelectReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
