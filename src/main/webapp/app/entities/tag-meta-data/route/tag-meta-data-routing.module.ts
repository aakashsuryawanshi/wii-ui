import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TagMetaDataComponent } from '../list/tag-meta-data.component';
import { TagMetaDataDetailComponent } from '../detail/tag-meta-data-detail.component';
import { TagMetaDataUpdateComponent } from '../update/tag-meta-data-update.component';
import { TagMetaDataRoutingResolveService } from './tag-meta-data-routing-resolve.service';

const tagMetaDataRoute: Routes = [
  {
    path: '',
    component: TagMetaDataComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TagMetaDataDetailComponent,
    resolve: {
      tagMetaData: TagMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TagMetaDataUpdateComponent,
    resolve: {
      tagMetaData: TagMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TagMetaDataUpdateComponent,
    resolve: {
      tagMetaData: TagMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tagMetaDataRoute)],
  exports: [RouterModule],
})
export class TagMetaDataRoutingModule {}
