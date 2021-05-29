import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { PUBLIC_ROUTE } from './private.route';
import { AnnotationComponent } from './annotation/annotation.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';
import { SecurityContext } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ImageCropperModule } from 'ngx-image-cropper';
import { QuestionEntryComponent } from './quention-entry/question-entry.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(PUBLIC_ROUTE),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    HttpClientModule,
    NzCarouselModule,
    NzTabsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NzListModule,
    NzPaginationModule,
    ImageCropperModule,
    NzTagModule,
    NzUploadModule,
    NzMessageModule,
  ],
  declarations: [AnnotationComponent, QuestionEntryComponent],
})
export class PrivateModule {}
