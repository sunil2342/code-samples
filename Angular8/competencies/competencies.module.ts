import { sv_cmplt_cpd_attch } from './../../../auth/_constant/url.component';
import { MyCompetencyComponent } from './competencies.component';
import { DefaultComponent } from './../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LayoutModule } from '../../layouts/layout.module';
import { FilterById } from "../../../auth/_pipes/filterById.pipe";
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';

import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TextMaskModule } from 'angular2-text-mask';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: 'http://api2.cpdportfolio.com.au/api/upload/cpdattachments',
    acceptedFiles: `image/*,application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    createImageThumbnails: true,
    maxFiles: 1,
  };

  const routes: Routes = [{
    "path":"",
    "component": DefaultComponent,
    "children":[
        {
            "path": "",
            "component": MyCompetencyComponent
        }

      ]
}
  ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),LayoutModule,
        DropzoneModule, TextMaskModule
    ],
    exports: [RouterModule],
    declarations: [MyCompetencyComponent],
    providers: [ {
        provide: DROPZONE_CONFIG,
        useValue: DEFAULT_DROPZONE_CONFIG
      }],
})
export class MyCompetencyModule { }
