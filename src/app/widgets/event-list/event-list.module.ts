import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { EventListComponent } from './event-list.component';

@NgModule({
    declarations: [EventListComponent],
    imports: [
        SharedModule
    ],
    exports: [EventListComponent]
})
export class EventListModule { }
