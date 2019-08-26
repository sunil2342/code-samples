import { AlertComponent } from './../../../auth/_directives/alert.component';
import { invite_friend } from './../../../auth/_constant/url.component';
import { CustomService } from './../../../auth/_services/custom.service';
import { ScriptLoaderService } from './../../../_services/script-loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from '../../../auth/_services';

declare var CpdToastr: any;

@Component({
    selector: 'app-invite-friend',
    styleUrls: ['invite-friend.component.scss'],
    templateUrl: 'invite-friend.component.html'
})
export class InviteFriendComponent implements OnInit {

    /* Variable of invite friend here */
    public invite_friend_form: FormGroup;
    email: any;
    loading = false;
    currUser: any;
    userId: any;
    public btn = { sbmt_btn: false, invite_sbmt_btn: false, msg: '' };
    constructor(private _script: ScriptLoaderService, private authService: AuthenticationService,
                private _customService: CustomService, private cfr: ComponentFactoryResolver)
    {
      this.userId = JSON.parse(localStorage.getItem("currentUser")).id;
    }
    ngOnInit() {
        this._script.loadScripts('app-chng-pwd',
            ['assets/demo/default/custom/components/base/toastr.js'])
        this.email = JSON.parse(localStorage.getItem("currentUser")).email;
        this.get_form();
    }
    /* Form for invite friend */
    get_form() {
        this.invite_friend_form = new FormGroup({
            email: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(6), this._customService.validateEmail])),
        });
    }
    /* method to invite friend */
    invite_sbmt(user) {
        this.btn.sbmt_btn = true;
        user.user_id = this.userId;
        this.loading = true;
        if (this.invite_friend_form.valid) {
            this._customService.post_wth_token(invite_friend, user).subscribe((data: any) => {
                this.loading = false;
                if (data.status == 1) {
                    CpdToastr.showMessage("success", data.message);
                    this.btn = { sbmt_btn: false, invite_sbmt_btn: false, msg: '' };
                    this.cancel();
                    this.invite_friend_form.reset();
                }else if(data.status == 0 && data.message == "token_expired"){
                    CpdToastr.showMessage("error", "Your Session Got Expired");
                    localStorage.setItem("sessExp", "true");                }
                else {
                    CpdToastr.showMessage("error", data.message)
                }
            },
            err=>{
                Helpers.setLoading(false);
                CpdToastr.showMessage("error", "Either something went wrong or invalid access.");
            })
        }
        else {
            this.loading = false;
        }
    }
    // Method called with cancel button //
    cancel() {
        this.btn.sbmt_btn = false;
        this.invite_friend_form.reset();
    }

}
