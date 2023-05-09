import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAccessSettingsComponent } from './bulk-access-settings.component';

describe('BulkAccessSettingsComponent', () => {
  let component: BulkAccessSettingsComponent;
  let fixture: ComponentFixture<BulkAccessSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAccessSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
