import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { MaterialsModule } from '../materials.module';
import { BackButtonComponent } from './back-button/back-button.component';
import { TableOptionComponent } from './table-option/table-option.component';
import { EventListComponent } from './event-list/event-list.component';
import { ScheduledEventsComponent } from './scheduled-events/scheduled-events.component'
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DragulaModule } from 'ng2-dragula';
import { ContentWindowComponent } from './content-window/content-window.component';

const components = [
  BackButtonComponent,
  TableOptionComponent,
  EventListComponent,
  ScheduledEventsComponent,
  ConfirmDialogComponent,
  ContentWindowComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialsModule,
    DragulaModule
  ],
  declarations: components,
  entryComponents: components,
  exports: components,
})
export class WidgetsModule { }
