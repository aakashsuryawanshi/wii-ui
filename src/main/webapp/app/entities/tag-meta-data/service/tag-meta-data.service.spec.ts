import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITagMetaData, TagMetaData } from '../tag-meta-data.model';

import { TagMetaDataService } from './tag-meta-data.service';

describe('Service Tests', () => {
  describe('TagMetaData Service', () => {
    let service: TagMetaDataService;
    let httpMock: HttpTestingController;
    let elemDefault: ITagMetaData;
    let expectedResult: ITagMetaData | ITagMetaData[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TagMetaDataService);
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

      it('should create a TagMetaData', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TagMetaData()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TagMetaData', () => {
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

      it('should partial update a TagMetaData', () => {
        const patchObject = Object.assign(
          {
            key: 'BBBBBB',
            value: 'BBBBBB',
          },
          new TagMetaData()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TagMetaData', () => {
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

      it('should delete a TagMetaData', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTagMetaDataToCollectionIfMissing', () => {
        it('should add a TagMetaData to an empty array', () => {
          const tagMetaData: ITagMetaData = { id: 123 };
          expectedResult = service.addTagMetaDataToCollectionIfMissing([], tagMetaData);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tagMetaData);
        });

        it('should not add a TagMetaData to an array that contains it', () => {
          const tagMetaData: ITagMetaData = { id: 123 };
          const tagMetaDataCollection: ITagMetaData[] = [
            {
              ...tagMetaData,
            },
            { id: 456 },
          ];
          expectedResult = service.addTagMetaDataToCollectionIfMissing(tagMetaDataCollection, tagMetaData);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TagMetaData to an array that doesn't contain it", () => {
          const tagMetaData: ITagMetaData = { id: 123 };
          const tagMetaDataCollection: ITagMetaData[] = [{ id: 456 }];
          expectedResult = service.addTagMetaDataToCollectionIfMissing(tagMetaDataCollection, tagMetaData);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tagMetaData);
        });

        it('should add only unique TagMetaData to an array', () => {
          const tagMetaDataArray: ITagMetaData[] = [{ id: 123 }, { id: 456 }, { id: 26223 }];
          const tagMetaDataCollection: ITagMetaData[] = [{ id: 123 }];
          expectedResult = service.addTagMetaDataToCollectionIfMissing(tagMetaDataCollection, ...tagMetaDataArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tagMetaData: ITagMetaData = { id: 123 };
          const tagMetaData2: ITagMetaData = { id: 456 };
          expectedResult = service.addTagMetaDataToCollectionIfMissing([], tagMetaData, tagMetaData2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tagMetaData);
          expect(expectedResult).toContain(tagMetaData2);
        });

        it('should accept null and undefined values', () => {
          const tagMetaData: ITagMetaData = { id: 123 };
          expectedResult = service.addTagMetaDataToCollectionIfMissing([], null, tagMetaData, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tagMetaData);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
