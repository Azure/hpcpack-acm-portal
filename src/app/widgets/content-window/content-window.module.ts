import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ContentWindowComponent } from './content-window.component';


@NgModule({
    declarations: [ContentWindowComponent],
    imports: [
        SharedModule
    ],
    exports: [
        ContentWindowComponent
    ]
})
export class ContentWindowModule { }
