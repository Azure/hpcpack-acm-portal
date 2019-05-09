import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ScheduledEventsComponent } from './scheduled-events.component';

@NgModule({
    declarations: [ScheduledEventsComponent],
    imports: [
        SharedModule
    ],
    exports: [ScheduledEventsComponent]
})
export class ScheduledEventModule { }
