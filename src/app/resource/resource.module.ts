import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { TreeModule } from 'angular-tree-component';
import { ChartModule } from 'angular2-chartjs';
import { ResourceRoutingModule } from './resource-routing.module';
import { MaterialsModule } from '../materials.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { ResourceComponent } from './resource.component';
import { NodeListComponent } from './node-list/node-list.component';
import { NodeDetailComponent } from './node-detail/node-detail.component';
import { NodeHeatmapComponent } from './node-heatmap/node-heatmap.component';
import { NewDiagnosticsComponent } from './new-diagnostics/new-diagnostics.component';
import { NewCommandComponent } from './new-command/new-command.component';

@NgModule({
  imports: [
    CommonModule,
    ResourceRoutingModule,
    MaterialsModule,
    FormsModule,
    TreeModule,
    WidgetsModule,
    ChartModule,
  ],
  declarations: [ResourceComponent, NodeListComponent, NodeDetailComponent, NodeHeatmapComponent, NewDiagnosticsComponent, NewCommandComponent],
  entryComponents: [NewDiagnosticsComponent, NewCommandComponent],
})
export class ResourceModule { }
