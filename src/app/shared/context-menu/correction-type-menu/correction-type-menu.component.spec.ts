import { Item } from './../../../core/shared/item.model';
import { DSpaceObject } from './../../../core/shared/dspace-object.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionTypeMenuComponent } from './correction-type-menu.component';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { CorrectionTypeDataService } from '../../../core/submission/correctiontype-data.service';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { By } from '@angular/platform-browser';
import { CorrectionType } from '../../../core/submission/models/correction-type-mode.model';

describe('CorrectionTypeMenuComponent', () => {
  let component: CorrectionTypeMenuComponent;
  let fixture: ComponentFixture<CorrectionTypeMenuComponent>;
  let componentAsAny: any;

  let correctionTypeService: any;
  let dso: DSpaceObject;
  const notificationService = new NotificationsServiceStub();
  const correctionType: CorrectionType = Object.assign(new CorrectionType(), {
     id: 'addpersonalpath',
     creationForm:'manageRelation',
     discoveryConfiguration: 'RELATION.PersonPath.Items',
     topic: '/DSPACEUSERS/RELATIONADD/PERSONALPATH'
  });

  const correctionTypeObjRDList$ = createSuccessfulRemoteDataObject$(createPaginatedList([correctionType]));

  beforeEach(async () => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    correctionTypeService = jasmine.createSpyObj('CorrectionTypeDataService', {
      findByItem: jasmine.createSpy('findByItem')
    });

    await TestBed.configureTestingModule({
      declarations: [ CorrectionTypeMenuComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: CorrectionTypeDataService, useValue: correctionTypeService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: NotificationsService, useValue: notificationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionTypeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when correction types are available', () => {
    beforeEach(() => {
      correctionTypeService.findByItem.and.returnValue(correctionTypeObjRDList$);
      fixture = TestBed.createComponent(CorrectionTypeMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init properly', () => {
      expect(componentAsAny.correctionTypes$.value).toEqual([correctionType]);
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });
  });

  describe('when is no data are available', () => {
    beforeEach(() => {
      correctionTypeService.findByItem.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([])));
      fixture = TestBed.createComponent(CorrectionTypeMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should init edit mode properly', () => {
      expect(componentAsAny.correctionTypes$.value).toEqual([]);
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });
});
