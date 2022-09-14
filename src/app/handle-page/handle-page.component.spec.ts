import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandlePageComponent } from './handle-page.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * The test class for the HandleTableComponent.
 */
describe('HandlePageComponent', () => {
  let component: HandlePageComponent;
  let fixture: ComponentFixture<HandlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ HandlePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
