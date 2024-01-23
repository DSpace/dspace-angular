import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedetteCollListeComponent } from './vedette-coll-liste.component';

describe('VedetteCollListeComponent', () => {
  let component: VedetteCollListeComponent;
  let fixture: ComponentFixture<VedetteCollListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VedetteCollListeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VedetteCollListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
