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

@NgModule({
  imports: [SharedModule, RouterModule.forChild([PUBLIC_ROUTE]), NzCarouselModule, NzTabsModule, BrowserModule, BrowserAnimationsModule],
  declarations: [LandingComponent, SemDetailsListViewComponent],
})
export class PublicModule {}
