import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thread-search-input',
  templateUrl: './thread-search-input.component.html',
  styleUrls: ['./thread-search-input.component.scss'],
})
export class ThreadSearchInputComponent implements OnInit {
  search = false;
  searchControl = new FormControl();
  @ViewChild('searchInput') searchInput: ElementRef;

  @Output() searchOut = new EventEmitter<any>();
  @Output() pendingFilter = new EventEmitter<any>();
  @Output() approvedFilter = new EventEmitter<any>();
  @Output() declinedFilter = new EventEmitter<any>();

  @Input() showFilter = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.searchControl.setValue('');
    });
  }

  onSearchFocus() {
    this.search = true;
    this.searchInput.nativeElement.focus();
  }

  onSearchOut() {
    this.search = false;
    this.searchOut.emit(this.searchControl.value);
  }
}
