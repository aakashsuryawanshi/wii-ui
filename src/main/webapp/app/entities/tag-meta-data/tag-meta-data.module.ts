import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TagMetaDataComponent } from './list/tag-meta-data.component';
import { TagMetaDataDetailComponent } from './detail/tag-meta-data-detail.component';
import { TagMetaDataUpdateComponent } from './update/tag-meta-data-update.component';
import { TagMetaDataDeleteDialogComponent } from './delete/tag-meta-data-delete-dialog.component';
import { TagMetaDataRoutingModule } from './route/tag-meta-data-routing.module';

@NgModule({
  imports: [SharedModule, TagMetaDataRoutingModule],
  declarations: [TagMetaDataComponent, TagMetaDataDetailComponent, TagMetaDataUpdateComponent, TagMetaDataDeleteDialogComponent],
  entryComponents: [TagMetaDataDeleteDialogComponent],
})
export class TagMetaDataModule {}
