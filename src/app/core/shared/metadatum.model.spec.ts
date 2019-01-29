import { Metadatum } from './metadatum.model';

describe('Metadatum', () => {
  let metadatum: Metadatum ;

  beforeEach(() => {
    metadatum = new Metadatum();
  });

  describe('isVirtual', () => {
    describe('when the metadatum has no authority key', () => {
      beforeEach(() => {
        metadatum.authority = undefined;
      });

      it('should return false', () => {
        expect(metadatum.isVirtual).toBe(false);
      });
    });

    describe('when the metadatum has an authority key', () => {
      describe('but it doesn\'t start with the virtual prefix', () => {
        beforeEach(() => {
          metadatum.authority = 'value';
        });

        it('should return false', () => {
          expect(metadatum.isVirtual).toBe(false);
        });
      });

      describe('and it starts with the virtual prefix', () => {
        beforeEach(() => {
          metadatum.authority = 'virtual::value';
        });

        it('should return true', () => {
          expect(metadatum.isVirtual).toBe(true);
        });
      });

    });

  });

  describe('virtualValue', () => {
    describe('when the metadatum isn\'t virtual', () => {
      beforeEach(() => {
        metadatum.authority = 'value';
      });

      it('should return undefined', () => {
        expect(metadatum.virtualValue).toBeUndefined();
      });
    });

    describe('when the metadatum is virtual', () => {
      beforeEach(() => {
        metadatum.authority = 'virtual::value';
      });

      it('should return everything in the authority key after virtual::', () => {
        expect(metadatum.virtualValue).toBe('value');
      });
    });
  });
});
