import { SearchService } from './../../../core/shared/search/search.service';
import { waitForAsync } from '@angular/core/testing';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSectionComponent } from './text-section.component';

xdescribe('TextSectionComponent', () => {
  let component: TextSectionComponent;
  let fixture: ComponentFixture<TextSectionComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // FIXME: complete scenarios
});
