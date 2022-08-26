import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectGoneComponent } from './objectgone.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ObjectGoneComponent', () => {
  let component: ObjectGoneComponent;
  let fixture: ComponentFixture<ObjectGoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ ObjectGoneComponent ]
    })
    .compileComponents();
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
