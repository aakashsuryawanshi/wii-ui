import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DomainComponent } from '../list/domain.component';
import { DomainDetailComponent } from '../detail/domain-detail.component';
import { DomainUpdateComponent } from '../update/domain-update.component';
import { DomainRoutingResolveService } from './domain-routing-resolve.service';

const domainRoute: Routes = [
  {
    path: '',
    component: DomainComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DomainDetailComponent,
    resolve: {
      domain: DomainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DomainUpdateComponent,
    resolve: {
      domain: DomainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DomainUpdateComponent,
    resolve: {
      domain: DomainRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(domainRoute)],
  exports: [RouterModule],
})
export class DomainRoutingModule {}
