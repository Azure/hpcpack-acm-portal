import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../materials.module';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NewGroupComponent } from './new-group/new-group.component';
import { SharedModule } from '../shared.module';
import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [
    GroupListComponent,
    NewGroupComponent
  ],
  imports: [
    CommonModule,
    MaterialsModule,
    GroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    SharedModule,
    WidgetsModule
  ],
  entryComponents: [NewGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupsModule { }
