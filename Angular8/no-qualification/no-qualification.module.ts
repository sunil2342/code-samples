import { NoQualificationComponent } from './no-qualification.component';
import { DefaultComponent} from '../default/default.component' ;
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layouts/layout.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,ReactiveFormsModule,LayoutModule
    ],
    declarations: [NoQualificationComponent],
    exports: [NoQualificationComponent],
    providers: [],
})
export class NoQualificationModule { }
