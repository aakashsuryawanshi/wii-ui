import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { PUBLIC_ROUTE } from './public.route';
import { LandingComponent } from './landing/landing.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SemDetailsListViewComponent } from './sem-details-list-view/sem-details-list-view.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';
import { SecurityContext } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([PUBLIC_ROUTE]),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    HttpClientModule,
    NzCarouselModule,
    NzTabsModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: [LandingComponent, SemDetailsListViewComponent, QuestionDetailsComponent],
})
export class PublicModule {}
