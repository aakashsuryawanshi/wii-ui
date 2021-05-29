import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

export type EntityResponseType = HttpResponse<string>;

@Injectable({ providedIn: 'root' })
export class TextExtractionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/text-extract');
  public resourceSecureUrl = this.applicationConfigService.getEndpointFor('api/secure/text-extract');
  public resourceBaseUrl = this.applicationConfigService.getEndpointFor('api');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  extract(fileData: FormData): Observable<EntityResponseType> {
    return this.http.post<string>(this.resourceSecureUrl, fileData, { observe: 'response' });
  }
}
