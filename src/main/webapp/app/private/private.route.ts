import { Route } from '@angular/router';

import { AnnotationComponent } from './annotation/annotation.component';
import { QuestionEntryComponent } from './quention-entry/question-entry.component';

export const PUBLIC_ROUTE: Route[] = [
  {
    path: 'annotation/:id/view',
    component: AnnotationComponent,
    data: {
      pageTitle: 'What Is Important....?',
    },
  },
  {
    path: 'question-entry/:id/view',
    component: QuestionEntryComponent,
    data: {
      pageTitle: 'What Is Important....?',
    },
  },
];
