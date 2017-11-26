import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Output() selectChange = new EventEmitter<any>();

  navLinks = [
    {label: 'Dashboard', link: '/admin/dashboard', icon: 'dashboard'},
    {label: 'Approve', link: '/admin/approve', icon: 'check'},
  ];

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  get authenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
