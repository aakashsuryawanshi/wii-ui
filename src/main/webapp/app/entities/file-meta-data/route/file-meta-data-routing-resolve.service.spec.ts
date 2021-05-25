jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFileMetaData, FileMetaData } from '../file-meta-data.model';
import { FileMetaDataService } from '../service/file-meta-data.service';

import { FileMetaDataRoutingResolveService } from './file-meta-data-routing-resolve.service';

describe('Service Tests', () => {
  describe('FileMetaData routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FileMetaDataRoutingResolveService;
    let service: FileMetaDataService;
    let resultFileMetaData: IFileMetaData | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FileMetaDataRoutingResolveService);
      service = TestBed.inject(FileMetaDataService);
      resultFileMetaData = undefined;
    });

    describe('resolve', () => {
      it('should return IFileMetaData returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFileMetaData = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFileMetaData).toEqual({ id: 123 });
      });

      it('should return new IFileMetaData if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFileMetaData = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFileMetaData).toEqual(new FileMetaData());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFileMetaData = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFileMetaData).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
