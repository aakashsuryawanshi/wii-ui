import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBranch, getBranchIdentifier } from '../branch.model';

export type EntityResponseType = HttpResponse<IBranch>;
export type EntityArrayResponseType = HttpResponse<IBranch[]>;

@Injectable({ providedIn: 'root' })
export class BranchService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/branches');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(branch: IBranch): Observable<EntityResponseType> {
    return this.http.post<IBranch>(this.resourceUrl, branch, { observe: 'response' });
  }

  update(branch: IBranch): Observable<EntityResponseType> {
    return this.http.put<IBranch>(`${this.resourceUrl}/${getBranchIdentifier(branch) as number}`, branch, { observe: 'response' });
  }

  partialUpdate(branch: IBranch): Observable<EntityResponseType> {
    return this.http.patch<IBranch>(`${this.resourceUrl}/${getBranchIdentifier(branch) as number}`, branch, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBranch>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBranch[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBranchToCollectionIfMissing(branchCollection: IBranch[], ...branchesToCheck: (IBranch | null | undefined)[]): IBranch[] {
    const branches: IBranch[] = branchesToCheck.filter(isPresent);
    if (branches.length > 0) {
      const branchCollectionIdentifiers = branchCollection.map(branchItem => getBranchIdentifier(branchItem)!);
      const branchesToAdd = branches.filter(branchItem => {
        const branchIdentifier = getBranchIdentifier(branchItem);
        if (branchIdentifier == null || branchCollectionIdentifiers.includes(branchIdentifier)) {
          return false;
        }
        branchCollectionIdentifiers.push(branchIdentifier);
        return true;
      });
      return [...branchesToAdd, ...branchCollection];
    }
    return branchCollection;
  }
}
