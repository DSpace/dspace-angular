import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAccessBrowseComponent } from './bulk-access-browse.component';

describe('BrowseComponent', () => {
  let component: BulkAccessBrowseComponent;
  let fixture: ComponentFixture<BulkAccessBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAccessBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAccessBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
