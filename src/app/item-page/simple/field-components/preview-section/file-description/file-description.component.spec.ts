import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MetadataBitstream } from 'src/app/core/metadata/metadata-bitstream.model';
import { ResourceType } from 'src/app/core/shared/resource-type';
import { FileDescriptionComponent } from './file-description.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HALEndpointService } from '../../../../../core/shared/hal-endpoint.service';
import { FileSizePipe } from '../../../../../shared/utils/file-size-pipe';

describe('FileDescriptionComponent', () => {
  let component: FileDescriptionComponent;
  let fixture: ComponentFixture<FileDescriptionComponent>;
  let halService: HALEndpointService;

  beforeEach(async () => {
    const configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'test',
        values: [
          'org.dspace.ctask.general.ProfileFormats = test'
        ]
      }))
    });

    halService = jasmine.createSpyObj('authService', {
      getRootHref: 'root url',
    });

    await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }), RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
      declarations: [FileDescriptionComponent, FileSizePipe],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: HALEndpointService, useValue: halService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDescriptionComponent);
    component = fixture.componentInstance;

    // Mock the input value
    const fileInput = new MetadataBitstream();
    fileInput.id = 123;
    fileInput.name = 'testFile';
    fileInput.description = 'test description';
    fileInput.fileSize = 2048;
    fileInput.checksum = 'abc';
    fileInput.type = new ResourceType('item');
    fileInput.fileInfo = [];
    fileInput.format = 'application/pdf';
    fileInput.canPreview = false;
    fileInput._links = {
      self: { href: '' },
      schema: { href: '' },
    };

    component.fileInput = fileInput;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the file name', () => {
    const fileNameElement = fixture.debugElement.query(
      By.css('.file-content dd')
    ).nativeElement;
    expect(fileNameElement.textContent).toContain('testFile');
  });
});
