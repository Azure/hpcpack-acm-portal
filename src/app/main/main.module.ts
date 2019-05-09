import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MainComponent } from './main.component';
import { SharedModule } from '../shared.module';
import { BackButtonModule } from '../widgets/back-button/back-button.module';

@NgModule({
  declarations: [
    MainComponent,
    BreadcrumbComponent
  ],
  imports: [
    SharedModule,
    MainRoutingModule,
    BackButtonModule
  ]
})
export class MainModule { }
