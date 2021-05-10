import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { DomainComponent } from './list/domain.component';
import { DomainDetailComponent } from './detail/domain-detail.component';
import { DomainUpdateComponent } from './update/domain-update.component';
import { DomainDeleteDialogComponent } from './delete/domain-delete-dialog.component';
import { DomainRoutingModule } from './route/domain-routing.module';

@NgModule({
  imports: [SharedModule, DomainRoutingModule],
  declarations: [DomainComponent, DomainDetailComponent, DomainUpdateComponent, DomainDeleteDialogComponent],
  entryComponents: [DomainDeleteDialogComponent],
})
export class DomainModule {}
