import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFileMetaData, getFileMetaDataIdentifier } from '../file-meta-data.model';

export type EntityResponseType = HttpResponse<IFileMetaData>;
export type EntityArrayResponseType = HttpResponse<IFileMetaData[]>;

@Injectable({ providedIn: 'root' })
export class FileMetaDataService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/file-meta-data');
  public resourceSecureUrl = this.applicationConfigService.getEndpointFor('api/secure/file-meta-data');
  public resourceBaseUrl = this.applicationConfigService.getEndpointFor('api');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fileMetaData: IFileMetaData): Observable<EntityResponseType> {
    return this.http.post<IFileMetaData>(this.resourceSecureUrl, fileMetaData, { observe: 'response' });
  }

  update(fileMetaData: IFileMetaData): Observable<EntityResponseType> {
    return this.http.put<IFileMetaData>(`${this.resourceSecureUrl}/${getFileMetaDataIdentifier(fileMetaData) as number}`, fileMetaData, {
      observe: 'response',
    });
  }

  partialUpdate(fileMetaData: IFileMetaData): Observable<EntityResponseType> {
    return this.http.patch<IFileMetaData>(`${this.resourceSecureUrl}/${getFileMetaDataIdentifier(fileMetaData) as number}`, fileMetaData, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFileMetaData>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFileMetaData[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceSecureUrl}/${id}`, { observe: 'response' });
  }

  addFileMetaDataToCollectionIfMissing(
    fileMetaDataCollection: IFileMetaData[],
    ...fileMetaDataToCheck: (IFileMetaData | null | undefined)[]
  ): IFileMetaData[] {
    const fileMetaData: IFileMetaData[] = fileMetaDataToCheck.filter(isPresent);
    if (fileMetaData.length > 0) {
      const fileMetaDataCollectionIdentifiers = fileMetaDataCollection.map(
        fileMetaDataItem => getFileMetaDataIdentifier(fileMetaDataItem)!
      );
      const fileMetaDataToAdd = fileMetaData.filter(fileMetaDataItem => {
        const fileMetaDataIdentifier = getFileMetaDataIdentifier(fileMetaDataItem);
        if (fileMetaDataIdentifier == null || fileMetaDataCollectionIdentifiers.includes(fileMetaDataIdentifier)) {
          return false;
        }
        fileMetaDataCollectionIdentifiers.push(fileMetaDataIdentifier);
        return true;
      });
      return [...fileMetaDataToAdd, ...fileMetaDataCollection];
    }
    return fileMetaDataCollection;
  }
}
