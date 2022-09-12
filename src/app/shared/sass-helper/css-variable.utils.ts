// Uses code from https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/

const isSameDomain = (styleSheet) => {
  // Internal style blocks won't have an href value
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(window.location.origin) === 0;
};

/*
 Determine if the given rule is a CSSStyleRule
 See: https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants
*/
const isStyleRule = (rule) => rule.type === 1;

/**
 * Get all custom properties on a page
 * @return array<array[string, string]>
 * ex; [["--color-accent", "#b9f500"], ["--color-text", "#252525"], ...]
 */
export const getCSSCustomPropIndex = (document: Document) =>
  // styleSheets is array-like, so we convert it to an array.
  // Filter out any stylesheets not on this domain
  [...document.styleSheets]
    .filter(isSameDomain)
    .reduce(
      (finalArr, sheet) =>
        finalArr.concat(
          // cssRules is array-like, so we convert it to an array
          [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule: any) => {
            const props = [...rule.style]
              .map((propName) => [
                propName.trim(),
                rule.style.getPropertyValue(propName).trim()
              ])
              // Discard any props that don't start with "--". Custom props are required to.
              .filter(([propName]) => propName.indexOf('--') === 0);

            return [...propValArr, ...props];
          }, [])
        ),
      []
    );

