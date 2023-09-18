import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDirectoryComponent } from './services-directory.component';

describe('ServicesDirectoryComponent', () => {
  let component: ServicesDirectoryComponent;
  let fixture: ComponentFixture<ServicesDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
