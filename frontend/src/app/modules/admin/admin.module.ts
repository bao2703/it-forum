import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ng2-dnd';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTopicComponent } from './manage-topic/manage-topic.component';
import { CreateTopicDialogComponent } from './manage-topic/create-topic-dialog/create-topic-dialog.component';
import { EditTopicDialogComponent } from './manage-topic/edit-topic-dialog/edit-topic-dialog.component';
import { MoveDialogComponent } from './manage-topic/move-dialog/move-dialog.component';
import { UserListComponent } from './manage-user/user-list/user-list.component';
import { UserListSearchInputComponent } from './manage-user/user-list/user-list-search-input/user-list-search-input.component';
import { ApproveUserComponent } from './manage-user/approve-user/approve-user.component';
import { ApproveUserSearchInputComponent } from './manage-user/approve-user/approve-user-search-input/approve-user-search-input.component';
import { UserDetailDialogComponent } from './manage-user/user-detail-dialog/user-detail-dialog.component';
import { ApproveService } from './approve.service';
import { ManageTagsComponent } from './manage-tags/manage-tags.component';
import { CreateTagDialogComponent } from './manage-tags/create-tag-dialog/create-tag-dialog.component';
import { EditTagDialogComponent } from './manage-tags/edit-tag-dialog/edit-tag-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DndModule,
    SharedModule,
    AdminRoutingModule,
    DashboardModule,
  ],
  declarations: [
    ManageUserComponent,
    ManageTopicComponent,
    CreateTopicDialogComponent,
    EditTopicDialogComponent,
    MoveDialogComponent,
    UserListComponent,
    UserListSearchInputComponent,
    ApproveUserComponent,
    ApproveUserSearchInputComponent,
    UserDetailDialogComponent,
    ManageTagsComponent,
    CreateTagDialogComponent,
    EditTagDialogComponent,
  ],
  entryComponents: [
    CreateTopicDialogComponent,
    EditTopicDialogComponent,
    MoveDialogComponent,
    UserDetailDialogComponent,
    CreateTagDialogComponent,
    EditTagDialogComponent,
  ],
  providers: [ApproveService],
})
export class AdminModule {
}
