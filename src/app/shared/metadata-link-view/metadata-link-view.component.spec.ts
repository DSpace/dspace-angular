import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLinkViewComponent } from './metadata-link-view.component';

describe('MetadataLinkViewComponent', () => {
  let component: MetadataLinkViewComponent;
  let fixture: ComponentFixture<MetadataLinkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataLinkViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataLinkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
