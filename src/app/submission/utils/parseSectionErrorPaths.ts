export interface SectionErrorPath {
  sectionId: string;
  fieldId: string;
  originalPath: string;
}

const regex = /\/sections\/(.*)\/(.*)/;

/**
 * the following method accept an array of section path strings and return a path object
 * @param {string | string[]} path
 * @returns {SectionErrorPath[]}
 */
const parseSectionErrorPaths = (path: string | string[]): SectionErrorPath[] => {
  const paths = typeof path === 'string' ? [ path ] : path;

  return paths.map((item) => ({
    sectionId: item.match(regex)[ 1 ],
    fieldId: item.match(regex)[ 2 ],
    originalPath: item,
  }))
};

export default parseSectionErrorPaths;
