import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDomain, Domain } from '../domain.model';

import { DomainService } from './domain.service';

describe('Service Tests', () => {
  describe('Domain Service', () => {
    let service: DomainService;
    let httpMock: HttpTestingController;
    let elemDefault: IDomain;
    let expectedResult: IDomain | IDomain[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DomainService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Domain', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Domain()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Domain', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Domain', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
          },
          new Domain()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Domain', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Domain', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDomainToCollectionIfMissing', () => {
        it('should add a Domain to an empty array', () => {
          const domain: IDomain = { id: 123 };
          expectedResult = service.addDomainToCollectionIfMissing([], domain);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(domain);
        });

        it('should not add a Domain to an array that contains it', () => {
          const domain: IDomain = { id: 123 };
          const domainCollection: IDomain[] = [
            {
              ...domain,
            },
            { id: 456 },
          ];
          expectedResult = service.addDomainToCollectionIfMissing(domainCollection, domain);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Domain to an array that doesn't contain it", () => {
          const domain: IDomain = { id: 123 };
          const domainCollection: IDomain[] = [{ id: 456 }];
          expectedResult = service.addDomainToCollectionIfMissing(domainCollection, domain);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(domain);
        });

        it('should add only unique Domain to an array', () => {
          const domainArray: IDomain[] = [{ id: 123 }, { id: 456 }, { id: 62286 }];
          const domainCollection: IDomain[] = [{ id: 123 }];
          expectedResult = service.addDomainToCollectionIfMissing(domainCollection, ...domainArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const domain: IDomain = { id: 123 };
          const domain2: IDomain = { id: 456 };
          expectedResult = service.addDomainToCollectionIfMissing([], domain, domain2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(domain);
          expect(expectedResult).toContain(domain2);
        });

        it('should accept null and undefined values', () => {
          const domain: IDomain = { id: 123 };
          expectedResult = service.addDomainToCollectionIfMissing([], null, domain, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(domain);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
