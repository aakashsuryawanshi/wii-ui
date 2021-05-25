import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FileMetaDataComponent } from './list/file-meta-data.component';
import { FileMetaDataDetailComponent } from './detail/file-meta-data-detail.component';
import { FileMetaDataUpdateComponent } from './update/file-meta-data-update.component';
import { FileMetaDataDeleteDialogComponent } from './delete/file-meta-data-delete-dialog.component';
import { FileMetaDataRoutingModule } from './route/file-meta-data-routing.module';

@NgModule({
  imports: [SharedModule, FileMetaDataRoutingModule],
  declarations: [FileMetaDataComponent, FileMetaDataDetailComponent, FileMetaDataUpdateComponent, FileMetaDataDeleteDialogComponent],
  entryComponents: [FileMetaDataDeleteDialogComponent],
})
export class FileMetaDataModule {}
