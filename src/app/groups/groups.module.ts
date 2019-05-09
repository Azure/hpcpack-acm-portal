import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../materials.module';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGroupComponent } from './new-group/new-group.component';
import { SharedModule } from '../shared.module';
import { VirtualScrollTableModule } from '../widgets/virtual-scroll-table/virtual-scroll-table.module';

@NgModule({
  declarations: [
    GroupListComponent,
    NewGroupComponent
  ],
  imports: [
    GroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollTableModule,
    SharedModule
  ],
  entryComponents: [NewGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupsModule { }
