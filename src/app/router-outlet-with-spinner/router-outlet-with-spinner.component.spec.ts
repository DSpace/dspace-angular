import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterOutletWithSpinnerComponent } from "./router-outlet-with-spinner.component";
import { SpinnerService } from "../spinner/spinner.service";
import { SpinnerState } from "../spinner/spinner.reducer";
import { Store, StoreModule } from "@ngrx/store";
import Spy = jasmine.Spy;
import { By } from '@angular/platform-browser';
import {
    CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { Observable } from "rxjs";

let comp: RouterOutletWithSpinnerComponent;
let fixture: ComponentFixture<RouterOutletWithSpinnerComponent>;
let store: Store<SpinnerState>;

describe('RouterOutletWithSpinnerComponent', () => {

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ StoreModule.provideStore({})],
            declarations: [ RouterOutletWithSpinnerComponent ],
            providers: [
                SpinnerService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]

        })
            .compileComponents();  // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(RouterOutletWithSpinnerComponent);

        comp = fixture.componentInstance;



        store = fixture.debugElement.injector.get(Store);
        spyOn(store, 'dispatch');
    });


    describe("when active in the store is true", () => {
        let routeroutletwithspinner: HTMLElement;

        beforeEach(() => {
            routeroutletwithspinner = fixture.debugElement.query(By.css('#ds-content')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: true }));
            fixture.detectChanges();
        });

        it("should hide the page contents", () => {
            expect(routeroutletwithspinner.attributes.getNamedItem("hidden").value).toEqual("");
        });

    });

    describe("when active in the store is false", () => {
        let routeroutletwithspinner: HTMLElement;

        beforeEach(() => {
            routeroutletwithspinner = fixture.debugElement.query(By.css('#ds-content')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: false }));
            fixture.detectChanges();
        });

        it("should show the page contents", () => {
            expect(routeroutletwithspinner.attributes["hidden"]).toBeUndefined();
        });

    });

});