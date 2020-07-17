import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutSearchBoxComponent } from './cris-layout-search-box.component';

describe('CrisLayoutSearchBoxComponent', () => {
  let component: CrisLayoutSearchBoxComponent;
  let fixture: ComponentFixture<CrisLayoutSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisLayoutSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
