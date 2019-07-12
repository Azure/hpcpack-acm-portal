import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupListComponent } from './group-list/group-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGroupComponent } from './new-group/new-group.component';
import { SharedModule } from '../../shared.module';
import { VirtualScrollTableModule, ConfirmDialogComponent, ConfirmDialogModule } from 'app/widgets';

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
    SharedModule,
    ConfirmDialogModule
  ],
  entryComponents: [NewGroupComponent, ConfirmDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupsModule { }
