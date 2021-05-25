import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFileDetails, FileDetails } from '../file-details.model';

import { FileDetailsService } from './file-details.service';

describe('Service Tests', () => {
  describe('FileDetails Service', () => {
    let service: FileDetailsService;
    let httpMock: HttpTestingController;
    let elemDefault: IFileDetails;
    let expectedResult: IFileDetails | IFileDetails[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FileDetailsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        sourceName: 'AAAAAAA',
        destinationName: 'AAAAAAA',
        destination: 'AAAAAAA',
        metaData: 'AAAAAAA',
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

      it('should create a FileDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FileDetails()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FileDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            sourceName: 'BBBBBB',
            destinationName: 'BBBBBB',
            destination: 'BBBBBB',
            metaData: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FileDetails', () => {
        const patchObject = Object.assign(
          {
            destinationName: 'BBBBBB',
            destination: 'BBBBBB',
            metaData: 'BBBBBB',
          },
          new FileDetails()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FileDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            sourceName: 'BBBBBB',
            destinationName: 'BBBBBB',
            destination: 'BBBBBB',
            metaData: 'BBBBBB',
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

      it('should delete a FileDetails', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFileDetailsToCollectionIfMissing', () => {
        it('should add a FileDetails to an empty array', () => {
          const fileDetails: IFileDetails = { id: 123 };
          expectedResult = service.addFileDetailsToCollectionIfMissing([], fileDetails);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fileDetails);
        });

        it('should not add a FileDetails to an array that contains it', () => {
          const fileDetails: IFileDetails = { id: 123 };
          const fileDetailsCollection: IFileDetails[] = [
            {
              ...fileDetails,
            },
            { id: 456 },
          ];
          expectedResult = service.addFileDetailsToCollectionIfMissing(fileDetailsCollection, fileDetails);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FileDetails to an array that doesn't contain it", () => {
          const fileDetails: IFileDetails = { id: 123 };
          const fileDetailsCollection: IFileDetails[] = [{ id: 456 }];
          expectedResult = service.addFileDetailsToCollectionIfMissing(fileDetailsCollection, fileDetails);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fileDetails);
        });

        it('should add only unique FileDetails to an array', () => {
          const fileDetailsArray: IFileDetails[] = [{ id: 123 }, { id: 456 }, { id: 59683 }];
          const fileDetailsCollection: IFileDetails[] = [{ id: 123 }];
          expectedResult = service.addFileDetailsToCollectionIfMissing(fileDetailsCollection, ...fileDetailsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fileDetails: IFileDetails = { id: 123 };
          const fileDetails2: IFileDetails = { id: 456 };
          expectedResult = service.addFileDetailsToCollectionIfMissing([], fileDetails, fileDetails2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fileDetails);
          expect(expectedResult).toContain(fileDetails2);
        });

        it('should accept null and undefined values', () => {
          const fileDetails: IFileDetails = { id: 123 };
          expectedResult = service.addFileDetailsToCollectionIfMissing([], null, fileDetails, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fileDetails);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
