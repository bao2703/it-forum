import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../models/tag';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { MatDialog } from '@angular/material';
import { EditTagDialogComponent } from './edit-tag-dialog/edit-tag-dialog.component';
import { FormControl } from '@angular/forms';
import { FilterByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss'],
})
export class ManageTagsComponent implements OnInit {
  tags: Tag[];
  filteredData;

  trash = false;

  searchControl = new FormControl();

  constructor(private loadingService: LoadingService,
              private tagService: TagService,
              private filterByPipe: FilterByPipe,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.tagService.getAll()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.tags = resp;
        this.filter();
        this.searchControl.reset();
      });

    this.searchControl.valueChanges.subscribe(value => this.filter(value));
  }

  filter(searchString = '') {
    this.filteredData = this.filterByPipe.transform(this.tags, ['name'], searchString);
  }

  create() {
    this.dialog.open(CreateTagDialogComponent, {
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.tags.push(result);
          this.filter();
          this.searchControl.reset();
        }
      });
  }

  edit(tag) {
    this.dialog.open(EditTagDialogComponent, {
      data: tag,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          const action = result.action;
          if (action === 'edit') {
            tag.name = result.data.name;
          } else if (action === 'delete' || action === 'restore') {
            const index = this.tags.indexOf(tag);
            this.tags.splice(index, 1);
          }
          this.filter();
          this.searchControl.reset();
        }
      });
  }

  getDeleted() {
    this.loadingService.spinnerStart();
    this.tagService.getAllDeleted()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.trash = true;
        this.tags = resp;
        this.filter();
        this.searchControl.reset();
      });
  }
}
