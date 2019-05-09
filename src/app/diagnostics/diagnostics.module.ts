import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ChartModule } from 'angular2-chartjs';
import { DiagnosticsRoutingModule } from './diagnostics-routing.module';
import { DiagnosticsComponent } from './diagnostics.component';
import { ResultListComponent } from './result-list/result-list.component';
import { ResultDetailComponent } from './result-detail/result-detail.component';
import { PingPongReportComponent } from './result-detail/diags/mpi/pingpong/pingpong-report/pingpong-report.component';
import { TaskDetailComponent } from './result-detail/task/task-detail/task-detail.component';
import { PingPongOverviewResultComponent } from './result-detail/diags/mpi/pingpong/overview-result/overview-result.component';
import { TaskTableComponent } from './result-detail/task/task-table/task-table.component';
import { ResultLayoutComponent } from './result-detail/result-layout/result-layout.component';
import { RingReportComponent } from './result-detail/diags/mpi/ring/ring-report/ring-report.component';
import { NodesInfoComponent } from './result-detail/diags/nodes-info/nodes-info.component';
import { SharedModule } from '../shared.module';
import { OverviewResultComponent } from './result-detail/diags/general-template/overview-result/overview-result.component';
import { GeneralReportComponent } from './result-detail/diags/general-template/general-report/general-report.component';
import { FailedReasonsComponent } from './result-detail/diags/mpi/pingpong/failed-reasons/failed-reasons.component';
import { GoodNodesComponent } from './result-detail/diags/mpi/pingpong/good-nodes/good-nodes.component';
import { PerformanceComponent } from './result-detail/diags/mpi/performance/performance.component';
import { ConnectivityComponent } from './result-detail/diags/mpi/pingpong/connectivity/connectivity.component';
import { VirtualScrollTableModule } from '../widgets/virtual-scroll-table/virtual-scroll-table.module';
import { EventListModule } from '../widgets/event-list/event-list.module';
import { ContentWindowModule } from '../widgets/content-window/content-window.module';
import { TableOptionComponent } from '../widgets/virtual-scroll-table/table-option/table-option.component';

@NgModule({
  imports: [
    DiagnosticsRoutingModule,
    VirtualScrollTableModule,
    ChartModule,
    FormsModule,
    SharedModule,
    EventListModule,
    ContentWindowModule
  ],
  declarations: [
    DiagnosticsComponent,
    ResultListComponent,
    ResultDetailComponent,
    PingPongReportComponent,
    TaskDetailComponent,
    PingPongOverviewResultComponent,
    TaskTableComponent,
    ResultLayoutComponent,
    RingReportComponent,
    NodesInfoComponent,
    OverviewResultComponent,
    GeneralReportComponent,
    FailedReasonsComponent,
    GoodNodesComponent,
    PerformanceComponent,
    ConnectivityComponent,
  ],
  entryComponents: [RingReportComponent, PingPongReportComponent, TaskDetailComponent, GeneralReportComponent, TableOptionComponent]
})
export class DiagnosticsModule { }