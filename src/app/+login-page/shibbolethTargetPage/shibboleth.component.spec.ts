import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShibbolethComponent } from './shibboleth.component';

describe('ShibbolethComponent', () => {
  let component: ShibbolethComponent;
  let fixture: ComponentFixture<ShibbolethComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShibbolethComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShibbolethComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
