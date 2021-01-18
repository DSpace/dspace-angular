import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../../core/data/remote-data';
import { RouterStub } from '../../../testing/router.stub';
import * as communityRouterPaths from '../../../../+community-page/community-page-routing-paths';
import { Community } from '../../../../core/shared/community.model';
import { CreateCommunityParentSelectorComponent } from './create-community-parent-selector.component';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';

describe('CreateCommunityParentSelectorComponent', () => {
  let component: CreateCommunityParentSelectorComponent;
  let fixture: ComponentFixture<CreateCommunityParentSelectorComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = { 'dc.title': [Object.assign(new MetadataValue(), { value: 'Community title', language: undefined })] };
  const router = new RouterStub();
  const communityRD = createSuccessfulRemoteDataObject(community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const createPath = 'testCreatePath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [CreateCommunityParentSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: communityRD,
                },
              },
            }
          },
        },
        {
          provide: Router, useValue: router
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    spyOnProperty(communityRouterPaths, 'getCommunityCreateRoute').and.callFake(() => {
      return () => createPath;
    });

    fixture = TestBed.createComponent(CreateCommunityParentSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(community);
    expect(router.navigate).toHaveBeenCalledWith([createPath], { queryParams: { parent: community.uuid } });
  });

});
