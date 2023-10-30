const pageMap = new Map();

export function renderCorrectionFor(creationMode: string) {
  return function decorator(component: any) {
    if (!component) {
      return;
    }
    pageMap.set(creationMode, component);
  };
}

export function getCorrectionComponent(creationMode: string) {
  return pageMap.get(creationMode);
}

