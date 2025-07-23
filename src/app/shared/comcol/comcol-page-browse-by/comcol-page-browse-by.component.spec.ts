import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment.test';

import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../remote-data.utils';
import { FollowLinkConfig } from '../../utils/follow-link-config.model';
import { ComcolPageBrowseByComponent } from './comcol-page-browse-by.component';

describe('ComcolPageBrowseByComponent', () => {
  let component: ComcolPageBrowseByComponent;
  let fixture: ComponentFixture<ComcolPageBrowseByComponent>;

  const communityId = '4a629890-275e-4243-80ce-18f0af03d8d6';
  const orgUnitId = '5eb40ac7-39b3-4d67-8f69-2c61167c9c63';
  const publicationId = '51a1af96-2f1f-4cb0-b213-f0d33a5e5391';

  let configurationServiceStub: any;
  let collectionServiceStub: any;

  beforeEach(waitForAsync(() => {

    collectionServiceStub = {
      findById(id: string, ...linksToFollow: FollowLinkConfig<Collection>[]): Observable<RemoteData<Collection>> {
        const relationshipTypeValue = new MetadataValue();
        relationshipTypeValue.value = id === orgUnitId ? 'OrgUnit' : 'Publication';
        const collection = Object.assign(new Collection(), {
          metadata: {
            'dspace.entity.type' : [relationshipTypeValue],
          },
        });
        return createSuccessfulRemoteDataObject$(collection);
      },
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
            return createFailedRemoteDataObject$('NOT FOUND', 404);
          case 'browse.collection.OrgUnit': {
            const collectionProperty = new ConfigurationProperty();
            collectionProperty.name = 'browse.collection.OrgUnit';
            collectionProperty.values = ['ouname'];
            return createSuccessfulRemoteDataObject$(collectionProperty);
          }
        }
      },
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }), ComcolPageBrowseByComponent],
      providers: [ComcolPageBrowseByComponent,
        { provide: APP_CONFIG, useValue: environment },
        { provide: ConfigurationDataService, useValue: configurationServiceStub },
        { provide: CollectionDataService, useValue: collectionServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

  }));

  describe('when object is a community', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
      component = fixture.componentInstance;
      component.id = communityId;
      component.contentType = 'community';

      fixture.detectChanges();
    });

    it('should have only two option',  () => {
      const navElements = fixture.debugElement.queryAll(By.css('.list-group-item'));
      expect(navElements).toHaveSize(2);

      expect(component.allOptions.length).toEqual(2);
      const firstOption = component.allOptions[0];
      expect(firstOption.id).toEqual('search');
      expect(firstOption.label).toEqual('community.page.browse.search.head');
      expect(firstOption.routerLink).toEqual('/communities/' + communityId + '/search');

      const secondOption = component.allOptions[1];
      expect(secondOption.id).toEqual('comcols');
      expect(secondOption.label).toEqual('community.all-lists.head');
      expect(secondOption.routerLink).toEqual('/communities/' + communityId + '/subcoms-cols');
    });
  });

  describe('when object is a collection', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ComcolPageBrowseByComponent);
      component = fixture.componentInstance;
      component.contentType = 'collection';
    });

    it('should have three options for the publication\'s collection',  () => {
      component.id = publicationId;
      fixture.detectChanges();

      const navElements = fixture.debugElement.queryAll(By.css('.list-group-item'));
      expect(navElements).toHaveSize(3);

      expect(component.allOptions.length).toEqual(3);
      const firstOption = component.allOptions[0];
      expect(firstOption.id).toEqual('search');
      expect(firstOption.label).toEqual('collection.page.browse.search.head');
      expect(firstOption.routerLink).toEqual('/collections/' + publicationId + '/search');
      const secondOption = component.allOptions[1];
      expect(secondOption.id).toEqual('author');
      expect(secondOption.label).toEqual('browse.comcol.by.author');
      expect(secondOption.routerLink).toEqual('/collections/' + publicationId + '/browse/author');
      const thirdOption = component.allOptions[2];
      expect(thirdOption.id).toEqual('title');
      expect(thirdOption.label).toEqual('browse.comcol.by.title');
      expect(thirdOption.routerLink).toEqual('/collections/' + publicationId + '/browse/title');
    });

    it('should have two options for the orgUnit\'s collection',  () => {
      component.id = orgUnitId;
      fixture.detectChanges();

      const navElements = fixture.debugElement.queryAll(By.css('.list-group-item'));
      expect(navElements).toHaveSize(2);

      expect(component.allOptions.length).toEqual(2);
      const firstOption = component.allOptions[0];
      expect(firstOption.id).toEqual('search');
      expect(firstOption.label).toEqual('collection.page.browse.search.head');
      expect(firstOption.routerLink).toEqual('/collections/' + orgUnitId + '/search');
      const secondOption = component.allOptions[1];
      expect(secondOption.id).toEqual('ouname');
      expect(secondOption.label).toEqual('browse.comcol.by.ouname');
      expect(secondOption.routerLink).toEqual('/collections/' + orgUnitId + '/browse/ouname');
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
  });

});
