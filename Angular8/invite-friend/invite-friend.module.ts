import { InviteFriendComponent } from './invite-friend.component';
import { DefaultComponent} from '../default/default.component' ;
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layouts/layout.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{
    "path":"",
    "component": DefaultComponent,
    "children":[
    {
        "path": "",
        "component": InviteFriendComponent
    }
]
}
  ];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),LayoutModule
    ],
    exports: [RouterModule,],
    declarations: [],
    providers: [],
})
export class InviteFriendModule { }
