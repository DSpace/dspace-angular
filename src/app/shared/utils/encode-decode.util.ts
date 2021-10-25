/**
 * use this to make a Base64 encoded string URL friendly,
 * i.e. '+' and '/' are replaced with special percent-encoded hexadecimal sequences
 *
 * @param {String} str the encoded string
 * @returns {String} the URL friendly encoded String
 */
export function loginEncodeUrl(str): string {
  return encodeURIComponent(str);
}
