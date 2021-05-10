import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBranch, Branch } from '../branch.model';
import { BranchService } from '../service/branch.service';

@Injectable({ providedIn: 'root' })
export class BranchRoutingResolveService implements Resolve<IBranch> {
  constructor(protected service: BranchService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBranch> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((branch: HttpResponse<Branch>) => {
          if (branch.body) {
            return of(branch.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Branch());
  }
}
