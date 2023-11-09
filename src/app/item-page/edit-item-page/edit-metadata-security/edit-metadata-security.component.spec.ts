import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetadataSecurityComponent } from './edit-metadata-security.component';
import { By } from '@angular/platform-browser';

describe('EditMetadataSecurityComponent', () => {
  let component: EditMetadataSecurityComponent;
  let fixture: ComponentFixture<EditMetadataSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMetadataSecurityComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetadataSecurityComponent);
    component = fixture.componentInstance;
  });

  describe('when security levels are defined', () => {

    beforeEach(() => {
      component.securityConfigLevel = [0, 1, 2];
    });

    describe('and security level is given', () => {
      beforeEach(() => {
        component.securityLevel = 1;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should render the switch buttons', () => {
        const btns = fixture.debugElement.queryAll(By.css('[data-test="switch-btn"]'));
        expect(btns.length).toBe(3);
      });
    });

    describe('and security level is not given and is a new field', () => {
      beforeEach(() => {
        component.isNewMdField = true;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should render the switch buttons', () => {
        const btns = fixture.debugElement.queryAll(By.css('[data-test="switch-btn"]'));
        expect(btns.length).toBe(3);
      });

      it('should init security', () => {
        expect(component.securityLevel).toBe(2);
      });
    });

    describe('and security level is not given and is not a new field', () => {
      beforeEach(() => {
        component.isNewMdField = false;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should render the switch buttons', () => {
        const btns = fixture.debugElement.queryAll(By.css('[data-test="switch-btn"]'));
        expect(btns.length).toBe(3);
      });

      it('should init security', () => {
        expect(component.securityLevel).toBe(0);
      });
    });
  });

  describe('when security levels are not defined', () => {

    beforeEach(() => {
      component.securityConfigLevel = [];
      fixture.detectChanges();
    });

    it('should not render the switch buttons', () => {
      const btns = fixture.debugElement.queryAll(By.css('[data-test="switch-btn"]'));
      expect(btns.length).toBe(0);
    });
  });
});
