import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FileMetaDataComponent } from '../list/file-meta-data.component';
import { FileMetaDataDetailComponent } from '../detail/file-meta-data-detail.component';
import { FileMetaDataUpdateComponent } from '../update/file-meta-data-update.component';
import { FileMetaDataRoutingResolveService } from './file-meta-data-routing-resolve.service';

const fileMetaDataRoute: Routes = [
  {
    path: '',
    component: FileMetaDataComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FileMetaDataDetailComponent,
    resolve: {
      fileMetaData: FileMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FileMetaDataUpdateComponent,
    resolve: {
      fileMetaData: FileMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FileMetaDataUpdateComponent,
    resolve: {
      fileMetaData: FileMetaDataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fileMetaDataRoute)],
  exports: [RouterModule],
})
export class FileMetaDataRoutingModule {}
