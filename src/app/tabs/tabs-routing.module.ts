import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () =>
          import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
        canActivate: [AuthGuard], // Protegendo a rota 'tab1'
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../tasks/tasks.module').then((m) => m.TasksPageModule),
        canActivate: [AuthGuard], // Protegendo a rota 'tab2'
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
        canActivate: [AuthGuard], // Protegendo a rota 'tab3'
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
