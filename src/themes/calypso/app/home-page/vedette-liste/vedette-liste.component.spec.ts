import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedetteListeComponent } from './vedette-liste.component';

describe('VedetteListeComponent', () => {
  let component: VedetteListeComponent;
  let fixture: ComponentFixture<VedetteListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VedetteListeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VedetteListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
