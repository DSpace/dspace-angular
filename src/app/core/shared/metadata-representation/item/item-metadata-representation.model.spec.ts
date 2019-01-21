import { MetadataRepresentationType } from '../metadata-representation.model';
import { ItemMetadataRepresentation, ItemTypeToPrimaryValue } from './item-metadata-representation.model';
import { Item } from '../../item.model';
import { Metadatum } from '../../metadatum.model';

describe('ItemMetadataRepresentation', () => {
  const valuePrefix = 'Test value for ';
  const item = new Item();
  let itemMetadataRepresentation: ItemMetadataRepresentation;
  item.metadata = Object.keys(ItemTypeToPrimaryValue).map((key: string) => {
    return Object.assign(new Metadatum(), {
      key: ItemTypeToPrimaryValue[key],
      value: `${valuePrefix}${ItemTypeToPrimaryValue[key]}`
    });
  });

  for (const itemType of Object.keys(ItemTypeToPrimaryValue)) {
    describe(`when creating an ItemMetadataRepresentation with item-type "${itemType}"`, () => {
      beforeEach(() => {
        itemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(itemType), item);
      });

      it('should have a representation type of item', () => {
        expect(itemMetadataRepresentation.representationType).toEqual(MetadataRepresentationType.Item);
      });

      it('should return the correct value when calling getPrimaryValue', () => {
        expect(itemMetadataRepresentation.getPrimaryValue()).toEqual(`${valuePrefix}${ItemTypeToPrimaryValue[itemType]}`);
      });

      it('should return the correct item type', () => {
        expect(itemMetadataRepresentation.itemType).toEqual(itemType);
      });
    });
  }
});
