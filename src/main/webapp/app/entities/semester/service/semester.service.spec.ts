import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISemester, Semester } from '../semester.model';

import { SemesterService } from './semester.service';

describe('Service Tests', () => {
  describe('Semester Service', () => {
    let service: SemesterService;
    let httpMock: HttpTestingController;
    let elemDefault: ISemester;
    let expectedResult: ISemester | ISemester[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SemesterService);
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

      it('should create a Semester', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Semester()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Semester', () => {
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

      it('should partial update a Semester', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          new Semester()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Semester', () => {
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

      it('should delete a Semester', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSemesterToCollectionIfMissing', () => {
        it('should add a Semester to an empty array', () => {
          const semester: ISemester = { id: 123 };
          expectedResult = service.addSemesterToCollectionIfMissing([], semester);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(semester);
        });

        it('should not add a Semester to an array that contains it', () => {
          const semester: ISemester = { id: 123 };
          const semesterCollection: ISemester[] = [
            {
              ...semester,
            },
            { id: 456 },
          ];
          expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, semester);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Semester to an array that doesn't contain it", () => {
          const semester: ISemester = { id: 123 };
          const semesterCollection: ISemester[] = [{ id: 456 }];
          expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, semester);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(semester);
        });

        it('should add only unique Semester to an array', () => {
          const semesterArray: ISemester[] = [{ id: 123 }, { id: 456 }, { id: 9053 }];
          const semesterCollection: ISemester[] = [{ id: 123 }];
          expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, ...semesterArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const semester: ISemester = { id: 123 };
          const semester2: ISemester = { id: 456 };
          expectedResult = service.addSemesterToCollectionIfMissing([], semester, semester2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(semester);
          expect(expectedResult).toContain(semester2);
        });

        it('should accept null and undefined values', () => {
          const semester: ISemester = { id: 123 };
          expectedResult = service.addSemesterToCollectionIfMissing([], null, semester, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(semester);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
