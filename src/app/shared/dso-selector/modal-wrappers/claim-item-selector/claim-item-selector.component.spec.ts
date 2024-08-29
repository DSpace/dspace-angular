import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ProfileClaimService } from '../../../../profile-page/profile-claim/profile-claim.service';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { ClaimItemSelectorComponent } from './claim-item-selector.component';

describe('ClaimItemSelectorComponent', () => {
  let component: ClaimItemSelectorComponent;
  let fixture: ComponentFixture<ClaimItemSelectorComponent>;

  const profileClaimService = jasmine.createSpyObj('profileClaimService', {
    searchForSuggestions: of({ payload: { page: [] } }),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ClaimItemSelectorComponent],
      providers: [
        { provide: NgbActiveModal, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ProfileClaimService, useValue: profileClaimService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ClaimItemSelectorComponent, { remove: { imports: [ListableObjectComponentLoaderComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
