import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISemester, getSemesterIdentifier } from '../semester.model';

export type EntityResponseType = HttpResponse<ISemester>;
export type EntityArrayResponseType = HttpResponse<ISemester[]>;

@Injectable({ providedIn: 'root' })
export class SemesterService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/semesters');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(semester: ISemester): Observable<EntityResponseType> {
    return this.http.post<ISemester>(this.resourceUrl, semester, { observe: 'response' });
  }

  update(semester: ISemester): Observable<EntityResponseType> {
    return this.http.put<ISemester>(`${this.resourceUrl}/${getSemesterIdentifier(semester) as number}`, semester, { observe: 'response' });
  }

  partialUpdate(semester: ISemester): Observable<EntityResponseType> {
    return this.http.patch<ISemester>(`${this.resourceUrl}/${getSemesterIdentifier(semester) as number}`, semester, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISemester>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISemester[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSemesterToCollectionIfMissing(semesterCollection: ISemester[], ...semestersToCheck: (ISemester | null | undefined)[]): ISemester[] {
    const semesters: ISemester[] = semestersToCheck.filter(isPresent);
    if (semesters.length > 0) {
      const semesterCollectionIdentifiers = semesterCollection.map(semesterItem => getSemesterIdentifier(semesterItem)!);
      const semestersToAdd = semesters.filter(semesterItem => {
        const semesterIdentifier = getSemesterIdentifier(semesterItem);
        if (semesterIdentifier == null || semesterCollectionIdentifiers.includes(semesterIdentifier)) {
          return false;
        }
        semesterCollectionIdentifiers.push(semesterIdentifier);
        return true;
      });
      return [...semestersToAdd, ...semesterCollection];
    }
    return semesterCollection;
  }
}
