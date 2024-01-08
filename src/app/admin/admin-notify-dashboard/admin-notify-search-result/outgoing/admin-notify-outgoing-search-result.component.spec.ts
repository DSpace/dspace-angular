import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotifyOutgoingSearchResultComponent } from './admin-notify-outgoing-search-result.component';

describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifyOutgoingSearchResultComponent;
  let fixture: ComponentFixture<AdminNotifyOutgoingSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNotifyOutgoingSearchResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifyOutgoingSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
