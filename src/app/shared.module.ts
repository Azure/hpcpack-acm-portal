import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from './materials.module';

@NgModule({
    exports: [CommonModule, MaterialsModule]
})

export class SharedModule { }