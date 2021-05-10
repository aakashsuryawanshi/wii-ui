import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BranchComponent } from '../list/branch.component';
import { BranchDetailComponent } from '../detail/branch-detail.component';
import { BranchUpdateComponent } from '../update/branch-update.component';
import { BranchRoutingResolveService } from './branch-routing-resolve.service';

const branchRoute: Routes = [
  {
    path: '',
    component: BranchComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BranchDetailComponent,
    resolve: {
      branch: BranchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BranchUpdateComponent,
    resolve: {
      branch: BranchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BranchUpdateComponent,
    resolve: {
      branch: BranchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(branchRoute)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
