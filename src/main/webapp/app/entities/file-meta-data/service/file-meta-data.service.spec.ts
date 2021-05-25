import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFileMetaData, FileMetaData } from '../file-meta-data.model';

import { FileMetaDataService } from './file-meta-data.service';

describe('Service Tests', () => {
  describe('FileMetaData Service', () => {
    let service: FileMetaDataService;
    let httpMock: HttpTestingController;
    let elemDefault: IFileMetaData;
    let expectedResult: IFileMetaData | IFileMetaData[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FileMetaDataService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        key: 'AAAAAAA',
        value: 'AAAAAAA',
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

      it('should create a FileMetaData', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FileMetaData()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FileMetaData', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            key: 'BBBBBB',
            value: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FileMetaData', () => {
        const patchObject = Object.assign(
          {
            key: 'BBBBBB',
            value: 'BBBBBB',
          },
          new FileMetaData()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FileMetaData', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            key: 'BBBBBB',
            value: 'BBBBBB',
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

      it('should delete a FileMetaData', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFileMetaDataToCollectionIfMissing', () => {
        it('should add a FileMetaData to an empty array', () => {
          const fileMetaData: IFileMetaData = { id: 123 };
          expectedResult = service.addFileMetaDataToCollectionIfMissing([], fileMetaData);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fileMetaData);
        });

        it('should not add a FileMetaData to an array that contains it', () => {
          const fileMetaData: IFileMetaData = { id: 123 };
          const fileMetaDataCollection: IFileMetaData[] = [
            {
              ...fileMetaData,
            },
            { id: 456 },
          ];
          expectedResult = service.addFileMetaDataToCollectionIfMissing(fileMetaDataCollection, fileMetaData);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FileMetaData to an array that doesn't contain it", () => {
          const fileMetaData: IFileMetaData = { id: 123 };
          const fileMetaDataCollection: IFileMetaData[] = [{ id: 456 }];
          expectedResult = service.addFileMetaDataToCollectionIfMissing(fileMetaDataCollection, fileMetaData);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fileMetaData);
        });

        it('should add only unique FileMetaData to an array', () => {
          const fileMetaDataArray: IFileMetaData[] = [{ id: 123 }, { id: 456 }, { id: 40710 }];
          const fileMetaDataCollection: IFileMetaData[] = [{ id: 123 }];
          expectedResult = service.addFileMetaDataToCollectionIfMissing(fileMetaDataCollection, ...fileMetaDataArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fileMetaData: IFileMetaData = { id: 123 };
          const fileMetaData2: IFileMetaData = { id: 456 };
          expectedResult = service.addFileMetaDataToCollectionIfMissing([], fileMetaData, fileMetaData2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fileMetaData);
          expect(expectedResult).toContain(fileMetaData2);
        });

        it('should accept null and undefined values', () => {
          const fileMetaData: IFileMetaData = { id: 123 };
          expectedResult = service.addFileMetaDataToCollectionIfMissing([], null, fileMetaData, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fileMetaData);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
