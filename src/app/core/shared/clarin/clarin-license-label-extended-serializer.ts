/**
 * The Clarin License REST/API accepts the licenseLabel.extended as boolean value but it is a string value
 * in the `define-license-label-form`. This serializer converts the string value to the appropriate boolean.
 */
export const ClarinLicenseLabelExtendedSerializer = {

  Serialize(extended: any): boolean {
    return extended === 'Yes';
  },
};
