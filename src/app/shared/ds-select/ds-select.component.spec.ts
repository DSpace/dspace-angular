import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsSelectComponent } from './ds-select.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DsSelectComponent', () => {
  let component: DsSelectComponent;
  let fixture: ComponentFixture<DsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        DsSelectComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
