import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotifyIncomingSearchResultComponent } from './admin-notify-incoming-search-result.component';

describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifyIncomingSearchResultComponent;
  let fixture: ComponentFixture<AdminNotifyIncomingSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyIncomingSearchResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyIncomingSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
