import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDomain, getDomainIdentifier } from '../domain.model';

export type EntityResponseType = HttpResponse<IDomain>;
export type EntityArrayResponseType = HttpResponse<IDomain[]>;

@Injectable({ providedIn: 'root' })
export class DomainService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/domains');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(domain: IDomain): Observable<EntityResponseType> {
    return this.http.post<IDomain>(this.resourceUrl, domain, { observe: 'response' });
  }

  update(domain: IDomain): Observable<EntityResponseType> {
    return this.http.put<IDomain>(`${this.resourceUrl}/${getDomainIdentifier(domain) as number}`, domain, { observe: 'response' });
  }

  partialUpdate(domain: IDomain): Observable<EntityResponseType> {
    return this.http.patch<IDomain>(`${this.resourceUrl}/${getDomainIdentifier(domain) as number}`, domain, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDomain>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDomain[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDomainToCollectionIfMissing(domainCollection: IDomain[], ...domainsToCheck: (IDomain | null | undefined)[]): IDomain[] {
    const domains: IDomain[] = domainsToCheck.filter(isPresent);
    if (domains.length > 0) {
      const domainCollectionIdentifiers = domainCollection.map(domainItem => getDomainIdentifier(domainItem)!);
      const domainsToAdd = domains.filter(domainItem => {
        const domainIdentifier = getDomainIdentifier(domainItem);
        if (domainIdentifier == null || domainCollectionIdentifiers.includes(domainIdentifier)) {
          return false;
        }
        domainCollectionIdentifiers.push(domainIdentifier);
        return true;
      });
      return [...domainsToAdd, ...domainCollection];
    }
    return domainCollection;
  }
}
