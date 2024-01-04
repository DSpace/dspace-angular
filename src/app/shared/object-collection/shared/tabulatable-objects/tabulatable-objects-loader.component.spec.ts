import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatableObjectsLoaderComponent } from './tabulatable-objects-loader.component';

describe('TabulatableObjectsComponent', () => {
  let component: TabulatableObjectsLoaderComponent;
  let fixture: ComponentFixture<TabulatableObjectsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabulatableObjectsLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabulatableObjectsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
