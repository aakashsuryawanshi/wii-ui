import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFileDetails, FileDetails } from '../file-details.model';
import { FileDetailsService } from '../service/file-details.service';

@Injectable({ providedIn: 'root' })
export class FileDetailsRoutingResolveService implements Resolve<IFileDetails> {
  constructor(protected service: FileDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFileDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fileDetails: HttpResponse<FileDetails>) => {
          if (fileDetails.body) {
            return of(fileDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FileDetails());
  }
}
