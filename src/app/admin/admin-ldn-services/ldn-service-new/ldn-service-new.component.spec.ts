import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LdnServiceNewComponent} from './ldn-service-new.component';

describe('LdnServiceNewComponent', () => {
    let component: LdnServiceNewComponent;
    let fixture: ComponentFixture<LdnServiceNewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LdnServiceNewComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LdnServiceNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
