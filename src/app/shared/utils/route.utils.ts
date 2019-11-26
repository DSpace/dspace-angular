import { Router } from '@angular/router';

export function currentPath(router: Router) {
  const urlTree = router.parseUrl(router.url);
  return '/' + urlTree.root.children.primary.segments.map((it) => it.path).join('/')
}
