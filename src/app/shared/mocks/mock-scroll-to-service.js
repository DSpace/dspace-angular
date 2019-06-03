/**
 * Mock for [[ScrollToService]]
 */
export function getMockScrollToService() {
    return jasmine.createSpyObj('scrollToService', {
        scrollTo: jasmine.createSpy('scrollTo')
    });
}
//# sourceMappingURL=mock-scroll-to-service.js.map