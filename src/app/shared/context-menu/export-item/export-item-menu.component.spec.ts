import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import {
  ItemExportFormConfiguration,
  ItemExportService,
} from '../../search/item-export/item-export.service';
import { ExportItemMenuComponent } from './export-item-menu.component';

describe('ExportItemMenuComponent', () => {
  let component: ExportItemMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ExportItemMenuComponent>;
  let scheduler: TestScheduler;
  let configuration: ItemExportFormConfiguration;

  let dso: DSpaceObject;
  const ngbModal = jasmine.createSpyObj('modal', ['open']);
  const itemExportService: any = jasmine.createSpyObj('ItemExportFormatService', {
    initialItemExportFormConfiguration: jasmine.createSpy('initialItemExportFormConfiguration'),
    onSelectEntityType: jasmine.createSpy('onSelectEntityType'),
    submitForm: jasmine.createSpy('submitForm'),
  });

  beforeEach(async(() => {
    itemExportService.initialItemExportFormConfiguration.and.returnValue(observableOf(configuration));
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' },
      },
    });

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ExportItemMenuComponent,
      ],
      providers: [
        { provide: ItemExportService, useValue: itemExportService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: NgbModal, useValue: ngbModal },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(ExportItemMenuComponent);
    component = fixture.componentInstance;
    configuration = { format: 'format', entityType: 'entityType' } as any;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a button', () => {
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).toBeNull();
  });

  it('should render a button', () => {
    fixture.detectChanges();
    const testConfig = { ...configuration, formats: [{ type: null, id: '1', mimeType: '1', entityType: 'Patent', molteplicity: '1', _links: null }] };
    component.configuration$.next(testConfig);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

  it('should open modal', () => {
    ngbModal.open.and.returnValue({
      componentInstance: { molteplicity: null, item: null },
      close: () => {
        return;
      },
    });
    component.openExportModal();
    expect(componentAsAny.modalService.open).toHaveBeenCalled();
  });

});
