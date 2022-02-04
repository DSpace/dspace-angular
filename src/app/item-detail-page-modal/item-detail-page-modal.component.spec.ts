import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';

// Import modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement } from '@angular/core';
import { ItemDetailPageModalComponent } from './item-detail-page-modal.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';



describe('ItemDetailPageModalComponent', () => {
  let component: ItemDetailPageModalComponent;
  let fixture: ComponentFixture<ItemDetailPageModalComponent>;
  let de: DebugElement;



  describe('when empty subscriptions', () => {

    beforeEach(async () => {


      await TestBed.configureTestingModule({
        imports: [
          CommonModule,
          NgbModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          }),
        ],
        declarations: [],
        providers: [
          { provide: ComponentFixtureAutoDetect, useValue: true },
        ]
      })
        .compileComponents();

      fixture = TestBed.createComponent(ItemDetailPageModalComponent);
      component = fixture.componentInstance;
      component.uuid = 'testid123';
      de = fixture.debugElement;

      fixture.detectChanges();

    });

    it('should be no table', () => {
      expect(component).toBeTruthy();
    });


  });



});
