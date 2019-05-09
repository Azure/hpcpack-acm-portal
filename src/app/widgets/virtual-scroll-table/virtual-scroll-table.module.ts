import { NgModule } from '@angular/core';
import { AccessibleTableRowDirective } from './accessible-table-row/accessible-table-row.directive';
import { LoadingProgressBarComponent } from './loading-progress-bar/loading-progress-bar.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { TableOptionComponent } from './table-option/table-option.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '../../shared.module';
import { AccessibleTableHeaderDirective } from './accessible-table-header/accessible-table-header.directive';

const declarationsArray = [
  AccessibleTableRowDirective,
  AccessibleTableHeaderDirective,
  LoadingProgressBarComponent,
  ScrollToTopComponent,
  TableOptionComponent
];


@NgModule({
  declarations: declarationsArray,
  imports: [
    SharedModule
  ],
  exports: [
    ...declarationsArray,
    ScrollingModule
  ]
})
export class VirtualScrollTableModule { }
