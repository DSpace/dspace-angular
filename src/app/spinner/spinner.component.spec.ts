import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SpinnerComponent } from "./spinner.component";
import { SpinnerService } from "./spinner.service";
import { Store, StoreModule } from "@ngrx/store";
import { SpinnerState } from "./spinner.reducer";
import Spy = jasmine.Spy;
import { By } from '@angular/platform-browser';
import { TranslateModule } from "ng2-translate";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

let comp: SpinnerComponent;
let fixture: ComponentFixture<SpinnerComponent>;
let store: Store<SpinnerState>;

describe('SpinnerComponent', () => {

    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ StoreModule.provideStore({}), TranslateModule.forRoot(), NgbCollapseModule.forRoot() ],
            declarations: [ SpinnerComponent ],
            providers: [
                SpinnerService
            ]

        })
            .compileComponents();  // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(SpinnerComponent);

        comp = fixture.componentInstance;



        store = fixture.debugElement.injector.get(Store);
        spyOn(store, 'dispatch');
    });
    

    describe("when active in the store is true", () => {
        let spinner: HTMLElement;

        beforeEach(() => {
            spinner = fixture.debugElement.query(By.css('#ds-spinner-component')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: true }));
            fixture.detectChanges();
        });

        it("should show the spinner", () => {
            expect(spinner.attributes["hidden"]).toBeUndefined();
        });

    });

    describe("when active in the store is false", () => {
        let spinner: HTMLElement;

        beforeEach(() => {
            spinner = fixture.debugElement.query(By.css('#ds-spinner-component')).nativeElement;
            spyOn(store, 'select').and.returnValue(Observable.of({ active: false }));
            fixture.detectChanges();
        });

        it("should hide the spinner", () => {
            expect(spinner.attributes.getNamedItem("hidden").value).toEqual("");
        });

    });

});