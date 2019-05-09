import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { BackButtonComponent } from './back-button.component';

@NgModule({
    declarations: [BackButtonComponent],
    imports: [
        SharedModule
    ],
    exports: [BackButtonComponent]
})
export class BackButtonModule { }
