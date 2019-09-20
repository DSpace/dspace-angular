import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShibbolethTargetPageComponent } from './shibboleth-target-page.component';

describe('ShibbolethComponent', () => {
  let component: ShibbolethTargetPageComponent;
  let fixture: ComponentFixture<ShibbolethTargetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShibbolethTargetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShibbolethTargetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
