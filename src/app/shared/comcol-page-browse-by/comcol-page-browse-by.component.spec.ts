import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { ComcolPageBrowseByComponent } from './comcol-page-browse-by.component';

describe('ComcolPageBrowseByComponent', () => {
  let component: ComcolPageBrowseByComponent;
  let fixture: ComponentFixture<ComcolPageBrowseByComponent>;

  const communityId = '4a629890-275e-4243-80ce-18f0af03d8d6';
  const orgUnitId = '5eb40ac7-39b3-4d67-8f69-2c61167c9c63';
  const publicationId = '51a1af96-2f1f-4cb0-b213-f0d33a5e5391';

  let configurationServiceStub: any;
  let collectionServiceStub: any;

  beforeEach(async(() => {

    collectionServiceStub = {
      findById(id: string, ...linksToFollow: FollowLinkConfig<Collection>[]): Observable<RemoteData<Collection>> {
        const relationshipTypeValue = new MetadataValue();
        relationshipTypeValue.value = id === orgUnitId ? 'OrgUnit' : 'Publication';
        const collection = Object.assign(new Collection(), {
          metadata: {
            'relationship.type' : [relationshipTypeValue]
          }
        });
        return createSuccessfulRemoteDataObject$(collection);
      }
    };

    configurationServiceStub = {
      findByPropertyName(name: string): Observable<RemoteData<ConfigurationProperty>> {
        switch ( name ) {
          case 'browse.community':
            return createFailedRemoteDataObject$('NOT FOUND', 404);
          case 'browse.collection': {
            const collectionProperty = new ConfigurationProperty();
            collectionProperty.name = 'browse.collection';
            collectionProperty.values = ['author','title'];
            return createSuccessfulRemoteDataObject$(collectionProperty);
          }
          case 'browse.collection.Publication':
            return createFailedRemoteDataObject$('NOT FOUND', 404,);
          case 'browse.collection.OrgUnit': {
            const collectionProperty = new ConfigurationProperty();
            collectionProperty.name = 'browse.collection.OrgUnit';
            collectionProperty.values = ['ouname'];
            return createSuccessfulRemoteDataObject$(collectionProperty);
          }
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ComcolPageBrowseByComponent],
      providers: [ComcolPageBrowseByComponent,
        { provide: ConfigurationDataService, useValue: configurationServiceStub },
        { provide: CollectionDataService, useValue: collectionServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  it('should create ComcolPageBrowseByComponent for a community with only one option',  () => {
    fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
    component = fixture.componentInstance;
    component.id = communityId;
    component.contentType = 'community';

    fixture.detectChanges();

    expect(component.allOptions.length).toEqual(1);
    const firstOption = component.allOptions[0];
    expect(firstOption.id).toEqual(communityId);
    expect(firstOption.label).toEqual('community.all-lists.head');
    expect(firstOption.routerLink).toEqual('/communities/' + communityId);
  });

  it('should create ComcolPageBrowseByComponent for the publication\'s collection with three option',  () => {
    fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
    component = fixture.componentInstance;
    component.id = publicationId;
    component.contentType = 'collection';

    fixture.detectChanges();

    expect(component.allOptions.length).toEqual(3);
    const firstOption = component.allOptions[0];
    expect(firstOption.id).toEqual(publicationId);
    expect(firstOption.label).toEqual('collection.page.browse.recent.head');
    expect(firstOption.routerLink).toEqual('/collections/' + publicationId);
    const secondOption = component.allOptions[1];
    expect(secondOption.id).toEqual('author');
    expect(secondOption.label).toEqual('browse.comcol.by.author');
    expect(secondOption.routerLink).toEqual('/browse/author');
    expect(secondOption.params).toEqual({ scope: publicationId});
    const thirdOption = component.allOptions[2];
    expect(thirdOption.id).toEqual('title');
    expect(thirdOption.label).toEqual('browse.comcol.by.title');
    expect(thirdOption.routerLink).toEqual('/browse/title');
    expect(thirdOption.params).toEqual({ scope: publicationId});
  });

  it('should create ComcolPageBrowseByComponent for the orgUnit\'s collection with two option',  () => {
    fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
    component = fixture.componentInstance;
    component.id = orgUnitId;
    component.contentType = 'collection';

    fixture.detectChanges();

    expect(component.allOptions.length).toEqual(2);
    const firstOption = component.allOptions[0];
    expect(firstOption.id).toEqual(orgUnitId);
    expect(firstOption.label).toEqual('collection.page.browse.recent.head');
    expect(firstOption.routerLink).toEqual('/collections/' + orgUnitId);
    const secondOption = component.allOptions[1];
    expect(secondOption.id).toEqual('ouname');
    expect(secondOption.label).toEqual('browse.comcol.by.ouname');
    expect(secondOption.routerLink).toEqual('/browse/ouname');
    expect(secondOption.params).toEqual({ scope: orgUnitId});
  });

  it('should display browse options when options are more then one',  () => {

    fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
    component = fixture.componentInstance;
    component.id = publicationId;
    component.contentType = 'collection';

    fixture.detectChanges();

    expect(component.allOptions.length).toEqual(3);

    const navElement = fixture.debugElement.query(By.css('nav'));
    expect(navElement).toBeTruthy();

  });

  it('should not display browse options when options aren\'t more then one',  () => {

    fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
    component = fixture.componentInstance;
    component.id = communityId;
    component.contentType = 'community';

    fixture.detectChanges();

    expect(component.allOptions.length).toEqual(1);

    const navElement = fixture.debugElement.query(By.css('nav'));
    expect(navElement).toBeNull();

  });
});
