import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComcolRoleComponent } from './comcol-role.component';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RequestService } from '../../../../core/data/request.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { Community } from '../../../../core/shared/community.model';
import { ComcolRole } from './comcol-role';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RemoteData } from '../../../../core/data/remote-data';
import { Group } from '../../../../core/eperson/models/group.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('ComcolRoleComponent', () => {

  let fixture: ComponentFixture<ComcolRoleComponent>;
  let comp: ComcolRoleComponent;
  let de: DebugElement;
  let groupService;
  let linkService;

  beforeEach(() => {

    groupService = jasmine.createSpyObj('groupService', {
      createComcolGroup: undefined,
      deleteComcolGroup: undefined,
    });

    linkService = {
      resolveLink: () => undefined,
    };

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: GroupDataService, useValue: groupService },
        { provide: LinkService, useValue: linkService },
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: RequestService, useValue: {} },
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComcolRoleComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    comp.comcolRole = new ComcolRole(
      'test name',
      'test link name',
    );

    comp.dso = new Community();

    fixture.detectChanges();
  });

  describe('when there is no group yet', () => {

    it('should have a create button but no delete button', () => {
      expect(de.query(By.css('.btn.create'))).toBeDefined();
      expect(de.query(By.css('.btn.delete'))).toBeNull();
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

  describe('when there is a group yet', () => {

    beforeEach(() => {
      Object.assign(comp.dso, {
        'test link name': observableOf(new RemoteData(
          false,
          false,
          true,
          undefined,
          new Group(),
        )),
      });

      fixture.detectChanges();
    });

    it('should have a delete button but no create button', () => {
      expect(de.query(By.css('.btn.delete'))).toBeDefined();
      expect(de.query(By.css('.btn.create'))).toBeNull();
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
