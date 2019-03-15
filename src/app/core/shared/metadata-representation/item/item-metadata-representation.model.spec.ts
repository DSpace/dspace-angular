import { MetadataRepresentationType } from '../metadata-representation.model';
import { ItemMetadataRepresentation, ItemTypeToValue } from './item-metadata-representation.model';
import { Item } from '../../item.model';
import { Metadatum } from '../../metadatum.model';

describe('ItemMetadataRepresentation', () => {
  const valuePrefix = 'Test value for ';
  const item = new Item();
  let itemMetadataRepresentation: ItemMetadataRepresentation;
  item.metadata = Object.keys(ItemTypeToValue).map((key: string) => {
    return Object.assign(new Metadatum(), {
      key: ItemTypeToValue[key],
      value: `${valuePrefix}${ItemTypeToValue[key]}`
    });
  });

  for (const itemType of Object.keys(ItemTypeToValue)) {
    describe(`when creating an ItemMetadataRepresentation with item-type "${itemType}"`, () => {
      beforeEach(() => {
        itemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(itemType), item);
      });

      it('should have a representation type of item', () => {
        expect(itemMetadataRepresentation.representationType).toEqual(MetadataRepresentationType.Item);
      });

      it('should return the correct value when calling getValue', () => {
        expect(itemMetadataRepresentation.getValue()).toEqual(`${valuePrefix}${ItemTypeToValue[itemType]}`);
      });

      it('should return the correct item type', () => {
        expect(itemMetadataRepresentation.itemType).toEqual(itemType);
      });
    });
  }
});
