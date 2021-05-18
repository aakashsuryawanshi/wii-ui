import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITagMetaData, getTagMetaDataIdentifier } from '../tag-meta-data.model';

export type EntityResponseType = HttpResponse<ITagMetaData>;
export type EntityArrayResponseType = HttpResponse<ITagMetaData[]>;

@Injectable({ providedIn: 'root' })
export class TagMetaDataService {
  public resourceSecureUrl = this.applicationConfigService.getEndpointFor('api/secure/tag-meta-data');
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tag-meta-data');
  public resourceBaseUrl = this.applicationConfigService.getEndpointFor('api/tag-meta-data');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(tagMetaData: ITagMetaData): Observable<EntityResponseType> {
    return this.http.post<ITagMetaData>(this.resourceSecureUrl, tagMetaData, { observe: 'response' });
  }

  update(tagMetaData: ITagMetaData): Observable<EntityResponseType> {
    return this.http.put<ITagMetaData>(`${this.resourceSecureUrl}/${getTagMetaDataIdentifier(tagMetaData) as number}`, tagMetaData, {
      observe: 'response',
    });
  }

  partialUpdate(tagMetaData: ITagMetaData): Observable<EntityResponseType> {
    return this.http.patch<ITagMetaData>(`${this.resourceSecureUrl}/${getTagMetaDataIdentifier(tagMetaData) as number}`, tagMetaData, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITagMetaData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByQuestion(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<ITagMetaData[]>(`${this.resourceBaseUrl}/question/${id}/tag-meta-data`, {
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITagMetaData[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceSecureUrl}/${id}`, { observe: 'response' });
  }

  addTagMetaDataToCollectionIfMissing(
    tagMetaDataCollection: ITagMetaData[],
    ...tagMetaDataToCheck: (ITagMetaData | null | undefined)[]
  ): ITagMetaData[] {
    const tagMetaData: ITagMetaData[] = tagMetaDataToCheck.filter(isPresent);
    if (tagMetaData.length > 0) {
      const tagMetaDataCollectionIdentifiers = tagMetaDataCollection.map(tagMetaDataItem => getTagMetaDataIdentifier(tagMetaDataItem)!);
      const tagMetaDataToAdd = tagMetaData.filter(tagMetaDataItem => {
        const tagMetaDataIdentifier = getTagMetaDataIdentifier(tagMetaDataItem);
        if (tagMetaDataIdentifier == null || tagMetaDataCollectionIdentifiers.includes(tagMetaDataIdentifier)) {
          return false;
        }
        tagMetaDataCollectionIdentifiers.push(tagMetaDataIdentifier);
        return true;
      });
      return [...tagMetaDataToAdd, ...tagMetaDataCollection];
    }
    return tagMetaDataCollection;
  }
}
