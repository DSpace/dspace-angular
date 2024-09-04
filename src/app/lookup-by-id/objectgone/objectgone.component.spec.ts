import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../shared/alert/alert.component';
import { MockActivatedRoute } from '../../shared/mocks/active-router.mock';
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
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
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
