import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileValueInputComponent } from './file-value-input.component';

describe('FileValueInputComponent', () => {
  let component: FileValueInputComponent;
  let fixture: ComponentFixture<FileValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
