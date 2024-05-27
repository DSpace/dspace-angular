import { MetadataValueFilter } from 'src/app/core/shared/metadata.models';
import { Item } from 'src/app/core/shared/item.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataLinkViewPopoverComponent } from './metadata-link-view-popover.component';
import { environment } from 'src/environments/environment.test';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { Bitstream } from 'src/app/core/shared/bitstream.model';

describe('MetadataLinkViewPopoverComponent', () => {
  let component: MetadataLinkViewPopoverComponent;
  let fixture: ComponentFixture<MetadataLinkViewPopoverComponent>;


  const itemMock = Object.assign(new Item(), {
    uuid: '1234-1234-1234-1234',

    firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
      return itemMock.metadata[keyOrKeys as string][0].value;
    },

    metadata: {
      'dc.title': [
        {
          value: 'file name',
          language: null
        }
      ],
      'dc.identifier.uri': [
        {
          value: 'http://example.com',
          language: null
        }
      ],
      'dc.description.abstract': [
        {
          value: 'Long text description',
          language: null
        }
      ],
      'organization.identifier.ror': [
        {
          value: 'https://ror.org/1234',
          language: null
        }
      ],
      'person.identifier.orcid': [
        {
          value: 'https://orcid.org/0000-0000-0000-0000',
          language: null
        }
      ],
      'dspace.entity.type': [
        {
          value: 'Person',
          language: null
        }
      ]
    },
    thumbnail: createSuccessfulRemoteDataObject$(new Bitstream())
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataLinkViewPopoverComponent ],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataLinkViewPopoverComponent);
    component = fixture.componentInstance;
    component.item = itemMock;
    itemMock.firstMetadataValue = jasmine.createSpy()
                                         .withArgs('dspace.entity.type').and.returnValue('Person')
                                         .withArgs('dc.title').and.returnValue('Test Title')
                                         .withArgs('dc.identifier.uri').and.returnValue('http://example.com')
                                         .withArgs('dc.description.abstract').and.returnValue('Long text description')
                                         .withArgs('organization.identifier.ror').and.returnValue('https://ror.org/1234')
                                         .withArgs('person.identifier.orcid').and.returnValue('https://orcid.org/0000-0000-0000-0000');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the item title', () => {
    const titleElement = fixture.debugElement.query(By.css('.font-weight-bold.h4'));
    expect(titleElement.nativeElement.textContent).toContain('Test Title');
  });

  it('should display a link for each metadata field that is a valid link', () => {
    component.entityMetdataFields = ['dc.identifier.uri'];
    fixture.detectChanges();
    const linkElement = fixture.debugElement.query(By.css('a[href="http://example.com"]'));
    expect(linkElement).toBeTruthy();
  });

  it('should retrieve the identifier subtype configuration based on the given metadata value', () => {
    const metadataValue = 'organization.identifier.ror';
    const expectedSubtypeConfig = environment.identifierSubtypes.find((config) => config.name === 'ror');
    expect(component.getSourceSubTypeIdentifier(metadataValue)).toEqual(expectedSubtypeConfig);
  });


  it('should check if a given metadata value is a valid link', () => {
    const validLink = 'http://example.com';
    const invalidLink = 'not a link';
    expect(component.isLink(validLink)).toBeTrue();
    expect(component.isLink(invalidLink)).toBeFalse();
  });

  it('should display the "more info" link with the correct router link', () => {
    spyOn(component, 'getItemPageRoute').and.returnValue('/item/' + itemMock.uuid);
    fixture.detectChanges();
    const moreInfoLinkElement = fixture.debugElement.query(By.css('a[data-test="more-info-link"]'));
    expect(moreInfoLinkElement.nativeElement.routerLink).toContain('/item/' + itemMock.uuid);
  });

  it('should display the avatar popover when item has a thumbnail', () => {
    const avatarPopoverElement = fixture.debugElement.query(By.css('ds-metadata-link-view-avatar-popover'));
    expect(avatarPopoverElement).toBeTruthy();
  });
});
