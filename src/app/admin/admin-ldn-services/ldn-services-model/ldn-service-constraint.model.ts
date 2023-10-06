
/**
 * A cosntrain that can be used when running a service
 */
export class LdnServiceConstraint {
  /**
   * The name of the constrain
   */
  name: string;

  /**
   * The value of the constrain
   */
  value: string;
}

export const EndorsmentConstrain = [
  {
    name: 'Type 1 Item',
    value: 'Type1'
  },
  {
    name: 'Type 2 Item',
    value: 'Type2'
  },
];
