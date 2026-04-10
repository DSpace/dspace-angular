export const mockSubmissionObjectDataService = jasmine.createSpyObj('SubmissionObjectService', {
  getHrefByID: jasmine.createSpy('getHrefByID'),
  findById: jasmine.createSpy('findById'),
});
