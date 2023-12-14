import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAccessControlComponent } from './collection-access-control.component';
import { ActivatedRoute } from '@angular/router';
import {
  AccessControlFormContainerComponent
} from '../../../shared/access-control-form-container/access-control-form-container.component';
import { of } from 'rxjs';

describe('CollectionAccessControlComponent', () => {
  let component: CollectionAccessControlComponent;
  let fixture: ComponentFixture<CollectionAccessControlComponent>;
  let routeStub = {
    parent: {
      parent: {
        data: {
          pipe: () => {
            return {
              pipe: () => {
                return of({});
              }
            };
          }
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionAccessControlComponent],
      providers: [{
        provide: ActivatedRoute, useValue: routeStub
      }]
    })
      .overrideComponent(CollectionAccessControlComponent, {
        remove: {
          imports: [AccessControlFormContainerComponent]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
