import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'domain',
        data: { pageTitle: 'Domains' },
        loadChildren: () => import('./domain/domain.module').then(m => m.DomainModule),
      },
      {
        path: 'branch',
        data: { pageTitle: 'Branches' },
        loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule),
      },
      {
        path: 'semester',
        data: { pageTitle: 'Semesters' },
        loadChildren: () => import('./semester/semester.module').then(m => m.SemesterModule),
      },
      {
        path: 'subject',
        data: { pageTitle: 'Subjects' },
        loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'Questions' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'tag-meta-data',
        data: { pageTitle: 'TagMetaData' },
        loadChildren: () => import('./tag-meta-data/tag-meta-data.module').then(m => m.TagMetaDataModule),
      },
      {
        path: 'content',
        data: { pageTitle: 'Contents' },
        loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
