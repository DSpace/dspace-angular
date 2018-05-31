/**
 * use this to make a Base64 encoded string URL friendly,
 * i.e. '+' and '/' are replaced with special percent-encoded hexadecimal sequences
 *
 * @param {String} str the encoded string
 * @returns {String} the URL friendly encoded String
 */
export function Base64EncodeUrl(str): string {
  return str.replace(/\+/g, '%2B').replace(/\//g, '%2F').replace(/\=/g, '%3D');
}
