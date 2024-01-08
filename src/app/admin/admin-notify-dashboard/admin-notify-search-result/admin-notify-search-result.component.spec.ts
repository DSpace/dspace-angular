import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result.component';

describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifySearchResultComponent;
  let fixture: ComponentFixture<AdminNotifySearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifySearchResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifySearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
