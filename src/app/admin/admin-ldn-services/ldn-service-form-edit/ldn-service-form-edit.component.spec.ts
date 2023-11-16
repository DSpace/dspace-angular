import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NgbDropdownModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LdnServiceFormEditComponent} from './ldn-service-form-edit.component';
import {ChangeDetectorRef, EventEmitter} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PaginationService} from 'ngx-pagination';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {LdnItemfiltersService} from '../ldn-services-data/ldn-itemfilters-data.service';
import {LdnServicesService} from '../ldn-services-data/ldn-services-data.service';
import {RouterStub} from '../../../shared/testing/router.stub';
import {MockActivatedRoute} from '../../../shared/mocks/active-router.mock';
import {NotificationsServiceStub} from '../../../shared/testing/notifications-service.stub';
import {of} from 'rxjs';
import {RouteService} from '../../../core/services/route.service';
import {provideMockStore} from '@ngrx/store/testing';

describe('LdnServiceFormEditComponent', () => {
  let component: LdnServiceFormEditComponent;
  let fixture: ComponentFixture<LdnServiceFormEditComponent>;

  let ldnServicesService: any;
  let ldnItemfiltersService: any;
  let cdRefStub: any;
  let modalService: any;

  const translateServiceStub = {
    get: () => of('translated-text'),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async () => {
    ldnServicesService = {
      update: () => ({}),
    };
    ldnItemfiltersService = {
      findAll: () => of(['item1', 'item2']),
    };
    cdRefStub = Object.assign({
      detectChanges: () => fixture.detectChanges()
    });
    modalService = {
      open: () => {/*comment*/
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), NgbDropdownModule],
      declarations: [LdnServiceFormEditComponent],
      providers: [
        {provide: LdnServicesService, useValue: ldnServicesService},
        {provide: LdnItemfiltersService, useValue: ldnItemfiltersService},
        {provide: Router, useValue: new RouterStub()},
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},
        {provide: ChangeDetectorRef, useValue: cdRefStub},
        {provide: NgbModal, useValue: modalService},
        {provide: NotificationsService, useValue: NotificationsServiceStub},
        {provide: TranslateService, useValue: translateServiceStub},
        {provide: PaginationService, useValue: {}},
        FormBuilder,
        RouteService,
        provideMockStore({}),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LdnServiceFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
