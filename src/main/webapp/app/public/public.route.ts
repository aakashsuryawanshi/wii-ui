import { Route } from '@angular/router';

import { LandingComponent } from './landing/landing.component';

export const PUBLIC_ROUTE: Route = {
  path: 'landing/:id/view',
  component: LandingComponent,
  data: {
    pageTitle: 'What Is Important....?',
  },
};
