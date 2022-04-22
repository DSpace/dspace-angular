import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataInformationComponent } from './metadata-information.component';

describe('MetadataInformationComponent', () => {
  let component: MetadataInformationComponent;
  let fixture: ComponentFixture<MetadataInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
