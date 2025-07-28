export const FORBIDDEN_PATH = '403';

export function getForbiddenRoute() {
  return `/${FORBIDDEN_PATH}`;
}

export const PAGE_NOT_FOUND_PATH = '404';

export function getPageNotFoundRoute() {
  return `/${PAGE_NOT_FOUND_PATH}`;
}

export const INTERNAL_SERVER_ERROR = '500';
export const ERROR_PAGE = 'error';

export function getPageInternalServerErrorRoute() {
  return `/${INTERNAL_SERVER_ERROR}`;
}
