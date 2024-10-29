import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DsoEditMetadataTextFieldComponent } from './dso-edit-metadata-text-field.component';

describe('DsoEditMetadataTextFieldComponent', () => {
  let component: DsoEditMetadataTextFieldComponent;
  let fixture: ComponentFixture<DsoEditMetadataTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DsoEditMetadataTextFieldComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DsoEditMetadataTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
