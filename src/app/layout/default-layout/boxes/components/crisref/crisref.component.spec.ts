import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisrefComponent } from './crisref.component';

describe('CrisrefComponent', () => {
  let component: CrisrefComponent;
  let fixture: ComponentFixture<CrisrefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisrefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
