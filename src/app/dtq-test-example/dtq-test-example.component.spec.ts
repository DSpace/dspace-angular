import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtqTestExampleComponent } from './dtq-test-example.component';
import {By} from '@angular/platform-browser';

describe('DtqTestExampleComponent', () => {
  let component: DtqTestExampleComponent;
  let fixture: ComponentFixture<DtqTestExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtqTestExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtqTestExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have specific context', () => {
    const tag = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(tag.innerHTML).toBe('dtq-test-example works!');
  });

  it('should not have wrong context', () => {
    const tag = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(tag.innerHTML).not.toBe('This text is not there!');
  });
});
