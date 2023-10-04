import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { MetadataBitstream } from 'src/app/core/metadata/metadata-bitstream.model';
import { RegistryService } from 'src/app/core/registry/registry.service';

import { PreviewSectionComponent } from './preview-section.component';
import { ResourceType } from 'src/app/core/shared/resource-type';
import { HALLink } from 'src/app/core/shared/hal-link.model';
import { Item } from 'src/app/core/shared/item.model';

describe('PreviewSectionComponent', () => {
  let component: PreviewSectionComponent;
  let fixture: ComponentFixture<PreviewSectionComponent>;
  let mockRegistryService: any;

  beforeEach(async () => {
    mockRegistryService = jasmine.createSpyObj('RegistryService', [
      'getMetadataBitstream',
    ]);

    await TestBed.configureTestingModule({
      declarations: [PreviewSectionComponent],
      providers: [{ provide: RegistryService, useValue: mockRegistryService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSectionComponent);
    component = fixture.componentInstance;

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
    mockRegistryService.getMetadataBitstream.and.returnValue(
      of(bitstreamStream)
    );

    component.item = new Item();
    component.item.handle = '12345';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMetadataBitstream on init', () => {
    expect(mockRegistryService.getMetadataBitstream).toHaveBeenCalled();
  });

  it('should set listOfFiles on init', (done) => {
    component.listOfFiles.subscribe((files) => {
      expect(files).toEqual([]);
      done();
    });
  });
});
