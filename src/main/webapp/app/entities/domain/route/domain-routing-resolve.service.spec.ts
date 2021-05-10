jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDomain, Domain } from '../domain.model';
import { DomainService } from '../service/domain.service';

import { DomainRoutingResolveService } from './domain-routing-resolve.service';

describe('Service Tests', () => {
  describe('Domain routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DomainRoutingResolveService;
    let service: DomainService;
    let resultDomain: IDomain | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DomainRoutingResolveService);
      service = TestBed.inject(DomainService);
      resultDomain = undefined;
    });

    describe('resolve', () => {
      it('should return IDomain returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDomain = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDomain).toEqual({ id: 123 });
      });

      it('should return new IDomain if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDomain = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDomain).toEqual(new Domain());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDomain = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDomain).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
