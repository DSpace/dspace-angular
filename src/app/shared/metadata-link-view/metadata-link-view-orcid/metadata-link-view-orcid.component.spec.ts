import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLinkViewOrcidComponent } from './metadata-link-view-orcid.component';

describe('MetadataLinkViewOrcidComponent', () => {
  let component: MetadataLinkViewOrcidComponent;
  let fixture: ComponentFixture<MetadataLinkViewOrcidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataLinkViewOrcidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetadataLinkViewOrcidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
