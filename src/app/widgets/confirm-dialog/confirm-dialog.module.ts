import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    declarations: [ConfirmDialogComponent],
    imports: [
        SharedModule
    ],
    exports: [ConfirmDialogComponent]
})
export class ConfirmDialogModule { }
