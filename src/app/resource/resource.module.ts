import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TreeModule } from 'angular-tree-component';
import { ChartModule } from 'angular2-chartjs';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { NodeListComponent } from './node-list/node-list.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import { NodeHeatmapComponent } from './node-heatmap/node-heatmap.component';
import { NewDiagnosticsComponent } from './new-diagnostics/new-diagnostics.component';
import { NewCommandComponent } from './new-command/new-command.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CpuComponent } from './node-heatmap/cpu/cpu.component';
import { NodeGroupComponent } from './node-group/node-group.component';
import { VirtualScrollTableModule } from '../widgets/virtual-scroll-table/virtual-scroll-table.module';
import { TableOptionComponent } from '../widgets/virtual-scroll-table/table-option/table-option.component';

@NgModule({
  imports: [
    ResourceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule.forRoot(),
    ChartModule,
    SharedModule,
    VirtualScrollTableModule
  ],
  declarations: [
    ResourceComponent,
    NodeListComponent,
    NodeDetailComponent,
    NodeHeatmapComponent,
    NewDiagnosticsComponent,
    NewCommandComponent,
    CpuComponent,
    NodeGroupComponent
  ],
  entryComponents: [NewDiagnosticsComponent, NewCommandComponent, NodeGroupComponent, TableOptionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResourceModule { }
