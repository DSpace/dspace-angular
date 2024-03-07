import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarinFilesSectionComponent } from './clarin-files-section.component';
import { RegistryService } from '../../core/registry/registry.service';
import { Router } from '@angular/router';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { RouterMock } from '../../shared/mocks/router.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { MetadataBitstream } from '../../core/metadata/metadata-bitstream.model';
import { ResourceType } from '../../core/shared/resource-type';
import { HALLink } from '../../core/shared/hal-link.model';
import { BehaviorSubject , of} from 'rxjs';

describe('ClarinFilesSectionComponent', () => {
  let component: ClarinFilesSectionComponent;
  let fixture: ComponentFixture<ClarinFilesSectionComponent>;

  let mockRegistryService: any;
  let halService: HALEndpointService;
  // Set up the mock service's getMetadataBitstream method to return a simple stream
  const metadatabitstream = new MetadataBitstream();
  metadatabitstream.id = 123;
  metadatabitstream.name = 'test';
  metadatabitstream.description = 'test';
  metadatabitstream.fileSize = '1MB';
  metadatabitstream.checksum = 'abc';
  metadatabitstream.type = new ResourceType('item');
  metadatabitstream.fileInfo = [];
  metadatabitstream.format = 'text';
  metadatabitstream.canPreview = false;
  metadatabitstream._links = {
    self: new HALLink(),
    schema: new HALLink(),
  };

  metadatabitstream._links.self.href = '';
  metadatabitstream._links.schema.href = '';
  const metadataBitstreams: MetadataBitstream[] = [metadatabitstream];
  const bitstreamStream = new BehaviorSubject(metadataBitstreams);

  beforeEach(async () => {
    mockRegistryService = jasmine.createSpyObj('RegistryService', {
      'getMetadataBitstream': of(bitstreamStream)
    }
    );
    halService = Object.assign(new HALEndpointServiceStub('some url'));

    await TestBed.configureTestingModule({
      declarations: [ ClarinFilesSectionComponent ],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RegistryService, useValue: mockRegistryService },
        { provide: Router, useValue: new RouterMock() },
        { provide: HALEndpointService, useValue: halService }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClarinFilesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
