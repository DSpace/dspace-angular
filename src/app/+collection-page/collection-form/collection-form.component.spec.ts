import { CommunityFormComponent } from './community-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CollectionFormComponent } from './collection-form.component';

describe('CommunityFormComponent', () => {
  let comp: CollectionFormComponent;
  let fixture: ComponentFixture<CollectionFormComponent>
  let location: Location;

  /* tslint:disable:no-empty */
  const locationStub = {
    back: () => {}
  };
  /* tslint:enable:no-empty */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CollectionFormComponent],
      providers: [
        { provide: Location, useValue: locationStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFormComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    location = (comp as any).location;
  });

  describe('when submitting', () => {
    let input: DebugElement;
    let submit: DebugElement;
    let cancel: DebugElement;
    let error: DebugElement;

    beforeEach(() => {
      input = fixture.debugElement.query(By.css('input#collection-name'));
      submit = fixture.debugElement.query(By.css('button#collection-submit'));
      cancel = fixture.debugElement.query(By.css('button#collection-cancel'));
      error = fixture.debugElement.query(By.css('div.invalid-feedback'));
    });

    it('should display an error when leaving name empty', () => {
      const el = input.nativeElement;

      el.value = '';
      el.dispatchEvent(new Event('input'));
      submit.nativeElement.click();
      fixture.detectChanges();

      expect(error.nativeElement.style.display).not.toEqual('none');
    });

    it('should navigate back when pressing cancel', () => {
      spyOn(location, 'back');
      cancel.nativeElement.click();
      fixture.detectChanges();

      expect(location.back).toHaveBeenCalled();
    });
  })
});
