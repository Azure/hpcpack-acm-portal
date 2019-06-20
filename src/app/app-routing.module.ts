import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  // component: MainComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: 'app/components/dashboard/dashboard.module#DashboardModule',
      data: { breadcrumb: "Dashboard" }
    },
    {
      path: 'resource',
      loadChildren: 'app/components/resource/resource.module#ResourceModule',
      data: { breadcrumb: "Resource" }
    },
    {
      path: 'groups',
      loadChildren: 'app/components/groups/groups.module#GroupsModule',
      data: { breadcrumb: "Groups" }
    },
    {
      path: 'diagnostics',
      loadChildren: 'app/components/diagnostics/diagnostics.module#DiagnosticsModule',
      data: { breadcrumb: "Diagnostics" }
    },
    {
      path: 'command',
      loadChildren: 'app/components/command/command.module#CommandModule',
      data: { breadcrumb: "Cluster Run" }
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
