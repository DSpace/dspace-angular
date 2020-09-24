import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComcolRoleComponent } from './comcol-role.component';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RequestService } from '../../../../core/data/request.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RemoteData } from '../../../../core/data/remote-data';
import { RouterTestingModule } from '@angular/router/testing';

describe('ComcolRoleComponent', () => {

  let fixture: ComponentFixture<ComcolRoleComponent>;
  let comp: ComcolRoleComponent;
  let de: DebugElement;

  let requestService;
  let groupService;

  let group;
  let statusCode;

  beforeEach(() => {

    requestService = {hasByHrefObservable: () => observableOf(true)};

    groupService = {
      findByHref: () => undefined,
      createComcolGroup: jasmine.createSpy('createComcolGroup'),
      deleteComcolGroup: jasmine.createSpy('deleteComcolGroup'),
    };

    spyOn(groupService, 'findByHref').and.callFake((link) => {
      if (link === 'test role link') {
        return observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          group,
          statusCode,
        ));
      }
    });

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: GroupDataService, useValue: groupService },
        { provide: RequestService, useValue: requestService },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComcolRoleComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    comp.comcolRole = {
      name: 'test role name',
      href: 'test role link',
    };

    fixture.detectChanges();
  });

  describe('when there is no group yet', () => {

    beforeEach(() => {
      group = null;
      statusCode = 204;
      fixture.detectChanges();
    });

    it('should have a create button but no restrict or delete button', () => {
      expect(de.query(By.css('.btn.create')))
        .toBeTruthy();
      expect(de.query(By.css('.btn.restrict')))
        .toBeNull();
      expect(de.query(By.css('.btn.delete')))
        .toBeNull();
    });

    describe('when the create button is pressed', () => {

      beforeEach(() => {
        de.query(By.css('.btn.create')).nativeElement.click();
      });

      it('should call the groupService create method', () => {
        expect(groupService.createComcolGroup).toHaveBeenCalled();
      });
    });
  });

  describe('when the related group is the Anonymous group', () => {

    beforeEach(() => {
      group = {
        name: 'Anonymous'
      };
      statusCode = 200;
      fixture.detectChanges();
    });

    it('should have a restrict button but no create or delete button', () => {
      expect(de.query(By.css('.btn.create')))
        .toBeNull();
      expect(de.query(By.css('.btn.restrict')))
        .toBeTruthy();
      expect(de.query(By.css('.btn.delete')))
        .toBeNull();
    });

    describe('when the restrict button is pressed', () => {

      beforeEach(() => {
        de.query(By.css('.btn.restrict')).nativeElement.click();
      });

      it('should call the groupService create method', () => {
        expect(groupService.createComcolGroup).toHaveBeenCalledWith(comp.dso, 'test role name', 'test role link');
      });
    });
  });

  describe('when the related group is a custom group', () => {

    beforeEach(() => {
      group = {
        name: 'custom group name'
      };
      statusCode = 200;
      fixture.detectChanges();
    });

    it('should have a delete button but no create or restrict button', () => {
      expect(de.query(By.css('.btn.create')))
        .toBeNull();
      expect(de.query(By.css('.btn.restrict')))
        .toBeNull();
      expect(de.query(By.css('.btn.delete')))
        .toBeTruthy();
    });

    describe('when the delete button is pressed', () => {

      beforeEach(() => {
        de.query(By.css('.btn.delete')).nativeElement.click();
      });

      it('should call the groupService delete method', () => {
        expect(groupService.deleteComcolGroup).toHaveBeenCalled();
      });
    });
  });
});
