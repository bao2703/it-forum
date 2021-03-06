import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DashboardComponent } from '../../modules/admin/dashboard/dashboard/dashboard.component';
import { debounce } from '../../modules/shared/common/decorators';

@Component({
  template: `
    <app-navbar [showSidenavToggle]="true" (sidenavToggle)="sidenavToggle()" class="fixed-top"></app-navbar>
    <mat-sidenav-container fullscreen>
      <mat-sidenav #sidenav [mode]="mode" [opened]="!smallScreen" (close)="redraw()" (open)="redraw()">
        <app-sidenav (selectChange)="sidenavSelectChange()"></app-sidenav>
      </mat-sidenav>
      <app-spinner></app-spinner>
      <router-outlet (activate)="onActivate($event)"></router-outlet>
      <div [style.height.px]="60"></div>
    </mat-sidenav-container>
  `,
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  smallScreen = false;
  mode = 'side';
  dashboardComponent: DashboardComponent;

  @ViewChild('sidenav') sidenav;

  @HostListener('window:resize')
  @debounce()
  onResize() {
    this.smallScreen = window.innerWidth < 960;
    if (this.smallScreen) this.mode = 'over';
    else this.mode = 'side';
  }

  constructor() {
    this.onResize();
  }

  ngOnInit() {
  }

  sidenavSelectChange() {
    if (this.smallScreen) {
      this.sidenav.close();
    }
  }

  onActivate($event) {
    if ($event instanceof DashboardComponent)
      this.dashboardComponent = $event;
  }

  sidenavToggle() {
    this.sidenav.toggle();
  }

  redraw() {
    if (this.dashboardComponent) {
      this.dashboardComponent.redraw();
    }
  }
}
