import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FileDetailsComponent } from '../list/file-details.component';
import { FileDetailsDetailComponent } from '../detail/file-details-detail.component';
import { FileDetailsUpdateComponent } from '../update/file-details-update.component';
import { FileDetailsRoutingResolveService } from './file-details-routing-resolve.service';

const fileDetailsRoute: Routes = [
  {
    path: '',
    component: FileDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FileDetailsDetailComponent,
    resolve: {
      fileDetails: FileDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FileDetailsUpdateComponent,
    resolve: {
      fileDetails: FileDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FileDetailsUpdateComponent,
    resolve: {
      fileDetails: FileDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fileDetailsRoute)],
  exports: [RouterModule],
})
export class FileDetailsRoutingModule {}
