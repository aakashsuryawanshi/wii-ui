import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { DomainService } from 'app/entities/domain/service/domain.service';
import { IDomain } from 'app/entities/domain/domain.model';
import { HttpResponse } from '@angular/common/http';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { BranchService } from 'app/entities/branch/service/branch.service';
import { IBranch } from 'app/entities/branch/branch.model';
import { HostListener } from '@angular/core';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  domains?: IDomain[];
  branches?: IBranch[];
  screenHeight?: number;
  screenWidth?: number;
  nzTabPosition: NzTabPosition = 'left';

  constructor(
    private accountService: AccountService,
    private router: Router,

    private domainService: DomainService,
    private branchService: BranchService
  ) {
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));

    this.branchService.query().subscribe((res: HttpResponse<IBranch[]>) => {
      this.branches = res.body ?? [];
      this.domainService.query().subscribe((resp: HttpResponse<IDomain[]>) => {
        this.domains = resp.body ?? [];
        for (let i = 0; i < this.domains.length; i++) {
          this.domains[i].branches = this.branches?.filter(a => a.domain!.id === (this.domains ? this.domains[i].id! : null));
        }
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any): void {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.warn(this.screenHeight, this.screenWidth);
    if (this.screenWidth < 400) {
      this.nzTabPosition = 'top';
    } else {
      this.nzTabPosition = 'left';
    }
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
