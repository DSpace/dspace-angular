import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationLoaderComponent } from './animation-loader.component';

describe('AnimationLoaderComponent', () => {
  let component: AnimationLoaderComponent;
  let fixture: ComponentFixture<AnimationLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
