import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BranchComponent } from './list/branch.component';
import { BranchDetailComponent } from './detail/branch-detail.component';
import { BranchUpdateComponent } from './update/branch-update.component';
import { BranchDeleteDialogComponent } from './delete/branch-delete-dialog.component';
import { BranchRoutingModule } from './route/branch-routing.module';

@NgModule({
  imports: [SharedModule, BranchRoutingModule],
  declarations: [BranchComponent, BranchDetailComponent, BranchUpdateComponent, BranchDeleteDialogComponent],
  entryComponents: [BranchDeleteDialogComponent],
})
export class BranchModule {}
