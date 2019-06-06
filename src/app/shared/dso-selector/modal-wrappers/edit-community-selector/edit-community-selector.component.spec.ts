import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../../../core/data/remote-data';
import { RouterStub } from '../../../testing/router-stub';
import * as communityRouter from '../../../../+community-page/community-page-routing.module';
import { EditCommunitySelectorComponent } from './edit-community-selector.component';
import { Community } from '../../../../core/shared/community.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';

describe('EditCommunitySelectorComponent', () => {
  let component: EditCommunitySelectorComponent;
  let fixture: ComponentFixture<EditCommunitySelectorComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = { 'dc.title': [Object.assign(new MetadataValue(), { value: 'Community title', language: undefined })] };
  const router = new RouterStub();
  const communityRD = new RemoteData(false, false, true, undefined, community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const editPath = 'testEditPath';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditCommunitySelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: { root: { firstChild: { firstChild: { data: observableOf({ community: communityRD }) } } } }
        },
        {
          provide: Router, useValue: router
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    spyOnProperty(communityRouter, 'getCommunityEditPath').and.callFake(() => {
        return () => editPath;
    });

    fixture = TestBed.createComponent(EditCommunitySelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(community);
    expect(router.navigate).toHaveBeenCalledWith([editPath]);
  });

});
