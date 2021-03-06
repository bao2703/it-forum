import { Component, OnDestroy, OnInit } from '@angular/core';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { UserService } from '../user.service';
import { User } from '../../../models/user';
import { LoadingService } from '../../../components/loading/loading.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;

  navLinks = [];

  constructor(private route: ActivatedRoute,
              private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.userService.getWithReputations(this.route.snapshot.params['userId'])
      .takeUntil(componentDestroyed(this))
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.user = resp;

        this.navLinks = [
          {label: 'Posts', link: `/user/${this.user.id}/posts`},
          {label: 'Threads', link: `/user/${this.user.id}/threads`},
        ];
      });
  }

  ngOnDestroy() {
  }
}
