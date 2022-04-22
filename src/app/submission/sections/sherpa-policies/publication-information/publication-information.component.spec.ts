import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationInformationComponent } from './publication-information.component';

describe('PublicationInformationComponent', () => {
  let component: PublicationInformationComponent;
  let fixture: ComponentFixture<PublicationInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
