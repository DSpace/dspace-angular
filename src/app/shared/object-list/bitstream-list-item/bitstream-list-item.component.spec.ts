import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitstreamListItemComponent } from './bitstream-list-item.component';

describe('BitstreamListItemComponent', () => {
  let component: BitstreamListItemComponent;
  let fixture: ComponentFixture<BitstreamListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitstreamListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
