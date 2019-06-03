export function getMockTranslateService() {
    return jasmine.createSpyObj('translateService', {
        get: jasmine.createSpy('get'),
        instant: jasmine.createSpy('instant')
    });
}
//# sourceMappingURL=mock-translate.service.js.map