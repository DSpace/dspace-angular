import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { Item } from '../shared/item.model';
import { MetadataValueFilter } from '../shared/metadata.models';
import { DSONameService } from './dso-name.service';

describe(`DSONameService`, () => {
  let service: DSONameService;
  let mockPersonName: string;
  let mockPerson: DSpaceObject;
  let mockEPersonNameFirst: string;
  let mockEPersonFirst: DSpaceObject;
  let mockEPersonName: string;
  let mockEPerson: DSpaceObject;
  let mockOrgUnitName: string;
  let mockOrgUnit: DSpaceObject;
  let mockDSOName: string;
  let mockDSO: DSpaceObject;

  beforeEach(() => {
    mockPersonName = 'Doe, John';
    mockPerson = Object.assign(new DSpaceObject(), {
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return mockPersonName;
      },
      getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
        return ['Person', Item, DSpaceObject];
      },
    });

    mockEPersonName = 'John Doe';
    mockEPerson = Object.assign(new DSpaceObject(), {
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return mockEPersonName;
      },
      getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
        return ['EPerson', Item, DSpaceObject];
      },
    });

    mockEPersonNameFirst = 'John';
    mockEPersonFirst = Object.assign(new DSpaceObject(), {
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return mockEPersonNameFirst;
      },
      getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
        return ['EPerson', Item, DSpaceObject];
      },
    });

    mockOrgUnitName = 'Molecular Spectroscopy';
    mockOrgUnit = Object.assign(new DSpaceObject(), {
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return mockOrgUnitName;
      },
      getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
        return ['OrgUnit', Item, DSpaceObject];
      },
    });

    mockDSOName = 'Lorem Ipsum';
    mockDSO = Object.assign(new DSpaceObject(), {
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
        return mockDSOName;
      },
      getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
        return [DSpaceObject];
      },
    });

    service = new DSONameService({ instant: (a) => a } as any);
  });

  describe(`getName`, () => {
    it(`should use the Person factory for Person entities`, () => {
      spyOn((service as any).factories, 'Person').and.returnValue('Bingo!');

      const result = service.getName(mockPerson);

      expect((service as any).factories.Person).toHaveBeenCalledWith(mockPerson);
      expect(result).toBe('Bingo!');
    });

    it(`should use the OrgUnit factory for OrgUnit entities`, () => {
      spyOn((service as any).factories, 'OrgUnit').and.returnValue('Bingo!');

      const result = service.getName(mockOrgUnit);

      expect((service as any).factories.OrgUnit).toHaveBeenCalledWith(mockOrgUnit);
      expect(result).toBe('Bingo!');
    });

    it(`should use the EPerson factory for EPerson objects`, () => {
      spyOn((service as any).factories, 'EPerson').and.returnValue('Bingo!');

      const result = service.getName(mockEPerson);

      expect((service as any).factories.EPerson).toHaveBeenCalledWith(mockEPerson);
      expect(result).toBe('Bingo!');
    });

    it(`should use the Default factory for regular DSpaceObjects`, () => {
      spyOn((service as any).factories, 'Default').and.returnValue('Bingo!');

      const result = service.getName(mockDSO);

      expect((service as any).factories.Default).toHaveBeenCalledWith(mockDSO);
      expect(result).toBe('Bingo!');
    });
  });

  describe(`factories.Person`, () => {
    describe(`with person.familyName and  person.givenName`, () => {
      beforeEach(() => {
        spyOn(mockPerson, 'firstMetadataValue').and.returnValues(...mockPersonName.split(', '));
      });

      it(`should return 'person.familyName, person.givenName'`, () => {
        const result = (service as any).factories.Person(mockPerson);
        expect(result).toBe(mockPersonName);
        expect(mockPerson.firstMetadataValue).toHaveBeenCalledWith('person.familyName');
        expect(mockPerson.firstMetadataValue).toHaveBeenCalledWith('person.givenName');
        expect(mockPerson.firstMetadataValue).not.toHaveBeenCalledWith('dc.title');
      });
    });

    describe(`without person.familyName and  person.givenName`, () => {
      beforeEach(() => {
        spyOn(mockPerson, 'firstMetadataValue').and.returnValues(undefined, undefined, mockPersonName);
      });

      it(`should return dc.title`, () => {
        const result = (service as any).factories.Person(mockPerson);
        expect(result).toBe(mockPersonName);
        expect(mockPerson.firstMetadataValue).toHaveBeenCalledWith('person.familyName');
        expect(mockPerson.firstMetadataValue).toHaveBeenCalledWith('person.givenName');
        expect(mockPerson.firstMetadataValue).toHaveBeenCalledWith('dc.title');
      });
    });
  });

  describe(`factories.EPerson`, () => {
    describe(`with eperson.firstname and without eperson.lastname`, () => {
      beforeEach(() => {
        spyOn(mockEPerson, 'firstMetadataValue').and.returnValues(...mockEPersonName.split(' '));
      });

      it(`should return 'eperson.firstname' and 'eperson.lastname'`, () => {
        const result = (service as any).factories.EPerson(mockEPerson);
        expect(result).toBe(mockEPersonName);
        expect(mockEPerson.firstMetadataValue).toHaveBeenCalledWith('eperson.firstname');
        expect(mockEPerson.firstMetadataValue).toHaveBeenCalledWith('eperson.lastname');
      });
    });

    describe(` with eperson.firstname and without eperson.lastname`, () => {
      beforeEach(() => {
        spyOn(mockEPersonFirst, 'firstMetadataValue').and.returnValues(mockEPersonNameFirst, undefined);
      });

      it(`should return 'eperson.firstname'`, () => {
        const result = (service as any).factories.EPerson(mockEPersonFirst);
        expect(result).toBe(mockEPersonNameFirst);
        expect(mockEPersonFirst.firstMetadataValue).toHaveBeenCalledWith('eperson.firstname');
        expect(mockEPersonFirst.firstMetadataValue).toHaveBeenCalledWith('eperson.lastname');
      });
    });
  });


  describe(`factories.OrgUnit`, () => {
    beforeEach(() => {
      spyOn(mockOrgUnit, 'firstMetadataValue').and.callThrough();
    });

    it(`should return 'organization.legalName'`, () => {
      const result = (service as any).factories.OrgUnit(mockOrgUnit);
      expect(result).toBe(mockOrgUnitName);
      expect(mockOrgUnit.firstMetadataValue).toHaveBeenCalledWith('organization.legalName');
    });
  });

  describe(`factories.Default`, () => {
    beforeEach(() => {
      spyOn(mockDSO, 'firstMetadataValue').and.callThrough();
    });

    it(`should return 'dc.title'`, () => {
      const result = (service as any).factories.Default(mockDSO);
      expect(result).toBe(mockDSOName);
      expect(mockDSO.firstMetadataValue).toHaveBeenCalledWith('dc.title');
    });
  });
});
