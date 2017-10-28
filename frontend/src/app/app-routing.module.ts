import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'topic',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: 'app/modules/auth/auth.module#AuthModule',
  },
  {
    path: 'topic',
    loadChildren: 'app/modules/topic/topic.module#TopicModule',
  },
  {
    path: 'thread',
    loadChildren: 'app/modules/thread/thread.module#ThreadModule',
  },
  {
    path: 'admin',
    loadChildren: 'app/modules/admin/admin.module#AdminModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
