import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAccessControlComponent } from './collection-access-control.component';

xdescribe('CollectionAccessControlComponent', () => {
  let component: CollectionAccessControlComponent;
  let fixture: ComponentFixture<CollectionAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionAccessControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
