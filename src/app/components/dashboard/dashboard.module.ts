import { NgModule } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NodeStateComponent } from './node-state/node-state.component';
import { JobOverviewComponent } from './job-overview/job-overview.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    ChartModule
  ],
  declarations: [DashboardComponent, NodeStateComponent, JobOverviewComponent],
  //bootstrap: [HomeComponent]
})
export class DashboardModule { }
