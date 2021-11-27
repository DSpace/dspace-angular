import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataRenderComponent } from './metadata-render.component';

describe('MetadataRenderComponent', () => {
  let component: MetadataRenderComponent;
  let fixture: ComponentFixture<MetadataRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
