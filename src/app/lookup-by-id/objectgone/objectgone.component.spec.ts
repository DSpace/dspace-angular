import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../shared/alert/alert.component';
import { ObjectGoneComponent } from './objectgone.component';

describe('ObjectGoneComponent', () => {
  let component: ObjectGoneComponent;
  let fixture: ComponentFixture<ObjectGoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ObjectGoneComponent,
      ],
    })
      .overrideComponent(ObjectGoneComponent, { remove: { imports: [AlertComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectGoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
