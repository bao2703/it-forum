import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { User } from '../../../../models/user';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LoadingService } from '../../../../components/loading/loading.service';
import { AuthService } from '../../../auth/auth.service';
import { ManageUserService } from '../manage-user.service';
import { UserService } from '../../../user/user.service';
import { debounce } from '../../../shared/common/decorators';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[];
  displayedColumns;

  dataSource: MatTableDataSource<User>;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private loadingService: LoadingService,
              private authService: AuthService,
              private userService: UserService,
              private manageUserService: ManageUserService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.onResize();
    this.loadingService.spinnerStart();
    this.manageUserService.getApprovedUser()
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.users = resp;
        this.users.splice(this.users.findIndex(item => item.id == this.authService.currentUser().id), 1);
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.matSort;
      });
  }

  ngOnDestroy() {
  }

  @HostListener('window:resize')
  @debounce()
  onResize() {
    if (window.innerWidth < 600) this.displayedColumns = ['email', 'role'];
    else if (window.innerWidth < 960) this.displayedColumns = ['email', 'role', 'dateCreated'];
    else this.displayedColumns = ['name', 'email', 'role', 'dateCreated'];
  }

  filter(searchString: string = '') {
    this.paginator.pageIndex = 0;
    this.dataSource.filter = searchString;
  }

  viewDetail(user: User) {
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      data: user.id,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) user.role = result;
    });
  }
}
