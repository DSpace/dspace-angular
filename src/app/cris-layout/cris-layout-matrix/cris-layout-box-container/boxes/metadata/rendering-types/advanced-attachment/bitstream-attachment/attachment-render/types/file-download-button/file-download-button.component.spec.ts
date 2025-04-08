import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthorizationDataService } from '../../../../../../../../../../../core/data/feature-authorization/authorization-data.service';
import { Bitstream } from '../../../../../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../../../../../shared/mocks/translate-loader.mock';
import { SharedModule } from '../../../../../../../../../../../shared/shared.module';

import { FileDownloadButtonComponent } from './file-download-button.component';
import { ConfigurationDataService } from '../../../../../../../../../../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../../../../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../../../../../../../../../../core/shared/configuration-property.model';

describe('FileDownloadButtonComponent', () => {
  let component: FileDownloadButtonComponent;
  let fixture: ComponentFixture<FileDownloadButtonComponent>;

  let authorizationService: AuthorizationDataService;

  let bitstream: Bitstream;
  let item: Item;
  let configurationDataService: ConfigurationDataService;

  function init() {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        self: { href: 'obj-selflink' }
      }
    });
    item = Object.assign(new Item(), {
      uuid: 'itemUuid',
      _links: {
        self: { href: 'obj-selflink' }
      }
    });
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'request.item.type',
        values: []
      }))
    });
  }


  beforeEach(async () => {

    init();

    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })],
      declarations: [FileDownloadButtonComponent],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ConfigurationDataService, useValue: configurationDataService }
      ]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadButtonComponent);
    component = fixture.componentInstance;
    component.bitstream = bitstream;
    component.item = item;
    (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(of(true));
    component.bitstreamPath$ = of({
      routerLink: 'test',
      queryParams: {}
    });
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show download button', () => {
    expect(fixture.debugElement.query(By.css('[data-test="download"]'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('[data-test="requestACopy"]'))).toBeFalsy();
  });

  it('should show can request a copy button', () => {
    (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[data-test="download"]'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('[data-test="requestACopy"]'))).toBeTruthy();
  });

  it('should show a disabled can request a copy button when request.item.type has no value', () => {
    (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('[data-test="requestACopy"]'));
    expect(btn.nativeNode.getAttribute('aria-disabled')).toBe('true');
    expect(btn.nativeNode.classList.contains('disabled')).toBeTrue();
  });
});
