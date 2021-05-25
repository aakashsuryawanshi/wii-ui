import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFileMetaData, FileMetaData } from '../file-meta-data.model';
import { FileMetaDataService } from '../service/file-meta-data.service';

@Injectable({ providedIn: 'root' })
export class FileMetaDataRoutingResolveService implements Resolve<IFileMetaData> {
  constructor(protected service: FileMetaDataService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFileMetaData> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fileMetaData: HttpResponse<FileMetaData>) => {
          if (fileMetaData.body) {
            return of(fileMetaData.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FileMetaData());
  }
}
