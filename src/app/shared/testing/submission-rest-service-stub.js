import { of as observableOf } from 'rxjs';
var SubmissionRestServiceStub = /** @class */ (function () {
    function SubmissionRestServiceStub() {
        this.linkPath = 'workspaceitems';
        this.deleteById = jasmine.createSpy('deleteById');
        this.fetchRequest = jasmine.createSpy('fetchRequest');
        this.getDataById = jasmine.createSpy('getDataById');
        this.getDataByHref = jasmine.createSpy('getDataByHref');
        this.getEndpointByIDHref = jasmine.createSpy('getEndpointByIDHref');
        this.patchToEndpoint = jasmine.createSpy('patchToEndpoint');
        this.postToEndpoint = jasmine.createSpy('postToEndpoint').and.returnValue(observableOf({}));
        this.submitData = jasmine.createSpy('submitData');
    }
    return SubmissionRestServiceStub;
}());
export { SubmissionRestServiceStub };
//# sourceMappingURL=submission-rest-service-stub.js.map