import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { v4 as uuidv4 } from 'uuid';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AuthorityConfidenceStateDirective } from './authority-confidence-state.directive';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { FormFieldMetadataValueObject } from '../builder/models/form-field-metadata-value.model';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { AUTHORITY_GENERATE, AUTHORITY_REFERENCE } from '../../../core/shared/metadata.utils';

describe('AuthorityConfidenceStateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [
        AuthorityConfidenceStateDirective,
        TestComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with no value provided', () => {

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-muted'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject('test value', null, null, uuidv4());
      fixture.detectChanges();
    });

    it('should display a text-success icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-success'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a reference authority', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject('test value', null, null, AUTHORITY_REFERENCE + 'authority');
      fixture.detectChanges();
    });

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-muted'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a generate authority', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject('test value', null, null, AUTHORITY_GENERATE + 'authority');
      fixture.detectChanges();
    });

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-muted'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority and uncertain confidence', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject(
        'test value',
        null,
        null,
        uuidv4(),
        null,
        0,
        ConfidenceType.CF_UNCERTAIN
      );
      fixture.detectChanges();
    });

    it('should display a text-info icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-warning'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority and ambiguous confidence', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject(
        'test value',
        null,
        null,
        uuidv4(),
        null,
        0,
        ConfidenceType.CF_AMBIGUOUS
      );
      fixture.detectChanges();
    });

    it('should display a text-warning icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-danger'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority and not found confidence', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject(
        'test value',
        null,
        null,
        uuidv4(),
        null,
        0,
        ConfidenceType.CF_NOTFOUND
      );
      fixture.detectChanges();
    });

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-dark'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority and failed confidence', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject(
        'test value',
        null,
        null,
        uuidv4(),
        null,
        0,
        ConfidenceType.CF_FAILED
      );
      fixture.detectChanges();
    });

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-dark'));
      expect(icon).toBeTruthy();
    });
  });

  describe('value with a valid authority and rejected confidence', () => {
    beforeEach(() => {
      component.authorityValue = new FormFieldMetadataValueObject(
        'test value',
        null,
        null,
        uuidv4(),
        null,
        0,
        ConfidenceType.CF_REJECTED
      );
      fixture.detectChanges();
    });

    it('should display a text-muted icon', () => {
      const icon = fixture.debugElement.query(By.css('i.text-dark'));
      expect(icon).toBeTruthy();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: `<i dsAuthorityConfidenceState
                class="far fa-circle fa-2x fa-fw"
                aria-hidden="true"
                [authorityValue]="authorityValue"></i>`
})
class TestComponent {

  authorityValue = null;

}
