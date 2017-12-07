import { Component, OnInit } from '@angular/core';
import { ApproveService } from '../../approve.service';
import { Post } from '../../../../../models/post';
import { LoadingService } from '../../../../../components/loading/loading.service';
import { ApprovalStatus } from '../../../../../models/approval-status';
import { OrderByPipe } from 'ngx-pipes';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-approve-post',
  templateUrl: './approve-post.component.html',
  styleUrls: ['./approve-post.component.scss'],
})
export class ApprovePostComponent implements OnInit {
  pendingPosts: Post[];

  currentPage = 1;
  pageSize = 20;
  paginatedData = [];

  constructor(private loadingService: LoadingService,
              private approveService: ApproveService,
              private orderByPipe: OrderByPipe,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.approveService.getPendingPosts()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.pendingPosts = this.orderByPipe.transform(resp, ['-dateCreated']);
        this.onPageChange();
      });
  }

  approve(post: Post) {
    this.approveService.approvePost(post.id, ApprovalStatus.Approved)
      .subscribe(() => {
        const index = this.pendingPosts.indexOf(post);
        this.pendingPosts.splice(index, 1);
        this.onPageChange();
      });
  }

  decline(post: Post) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.approveService.approvePost(post.id, ApprovalStatus.Declined)
          .subscribe(() => {
            const index = this.pendingPosts.indexOf(post);
            this.pendingPosts.splice(index, 1);
            this.onPageChange();
          });
      }
    });
  }

  onPageChange() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = this.pendingPosts.slice(startIndex, startIndex + this.pageSize);
  }
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div mat-dialog-content class="d-flex justify-content-center">
      <p>Are you sure?</p>
    </div>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true" tabindex="1">Yes</button>
      <button mat-button mat-dialog-close tabindex="-1">No</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor() {
  }
}
