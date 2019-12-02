import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingMetadataListElementComponent } from './existing-metadata-list-element.component';

describe('ExistingMetadataListElementComponent', () => {
  let component: ExistingMetadataListElementComponent;
  let fixture: ComponentFixture<ExistingMetadataListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingMetadataListElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingMetadataListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
