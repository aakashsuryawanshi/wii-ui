import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDomain, Domain } from '../domain.model';
import { DomainService } from '../service/domain.service';

@Injectable({ providedIn: 'root' })
export class DomainRoutingResolveService implements Resolve<IDomain> {
  constructor(protected service: DomainService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDomain> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((domain: HttpResponse<Domain>) => {
          if (domain.body) {
            return of(domain.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Domain());
  }
}
