import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherPolicyComponent } from './publisher-policy.component';

describe('PublisherPolicyComponent', () => {
  let component: PublisherPolicyComponent;
  let fixture: ComponentFixture<PublisherPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublisherPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
