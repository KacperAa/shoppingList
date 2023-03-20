import { ViewportRuler } from '@angular/cdk/scrolling';

export function checkViewSize(viewportRuler: ViewportRuler): boolean {
  const viewSize = viewportRuler.getViewportSize().width;
  if (viewSize < 710) {
    return true;
  } else {
    return false;
  }
}
