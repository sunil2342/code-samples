import { AlertComponent } from './../../../auth/_directives/alert.component';
import { CustomService } from './../../../auth/_services/custom.service';
import { ScriptLoaderService } from './../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from '../../../auth/_services';
import {
 get_prof_info, upd_user_qual, get_qual_url, get_rol_ovr_year_url, add_qual
} from '../../../auth/_constant/url.component';
import { log } from 'util';

declare var $: any;
declare var CpdToastr: any;

@Component({ 
  selector: 'app-no-qualification',
  templateUrl: './no-qualification.component.html',
  styleUrls: ['./no-qualification.component.scss']
})
export class NoQualificationComponent  {

  /* Variable of no qualification here */
  sess: any = { end_year: "", id: "", start_year: "", year_plan: "" };
  email: any;
  loading = false;
  currUser: any;
  userId: any;
  qualificationTypeList: any = [];
  duplicateQualificationTypeList: any = [];
  qualificationformDetected;
  showDatepicker = false;
  sbmt_pers_btn = false;
  formType: any = 'Add';
  formchanged = false;
  add: any = true;
  loader = false;
  presentSession: any;
  rollOverList: any = [];
  year: any;
  yearsList: any = [];
  professionalInfoList: any = [];
  custom:any = 1;
  

  customList = [{ id: 0, text: "Yes", value: true }, { id: 1, text: "No" }];

  public btn = { sbmt_btn: false, invite_sbmt_btn: false, msg: '' };
  constructor(private _script: ScriptLoaderService, private customService: CustomService,
    private ref: ChangeDetectorRef, private authService: AuthenticationService) 
  {
    this.userId = JSON.parse(localStorage.getItem("currentUser")).id;

    
        // Form(attributes) for Qualification Form //
        this.qualificationformDetected = new FormGroup({
            id: new FormControl(""),
            qualification_id: new FormControl("", Validators.required),
            prev_qualification_id: new FormControl(""),
            custom: new FormControl(this.customList[0].id, Validators.compose([Validators.required])),
            reg_date: new FormControl(this.rgst_year_date_vldtn(), Validators.required)
        })

        this.userId = JSON.parse(localStorage.getItem("currentUser")).id
        this.sess = JSON.parse(localStorage.getItem("roll"));

  }
  ngOnInit() {
    this.check_route();
      this._script.loadScripts('app-chng-pwd',
          ['assets/demo/default/custom/components/base/toastr.js'])
      this.email = JSON.parse(localStorage.getItem("currentUser")).email;
       
      var self = this;
             
              this.getQualificationsList();
             // this.getRollOverYearList();

              /* Date Picker */
              $('#m_datepicker_detected').datepicker({
                format: 'dd/mm/yyyy',
                todayHighlight: true,
                orientation: "bottom left",
                templates: {
                    leftArrow: '<i class="la la-angle-left"></i>',
                    rightArrow: '<i class="la la-angle-right"></i>'
                },
                autoclose: true
            }).on("change", function (e) {
                if (e.target.value) {
                    self.qualificationformDetected.controls['reg_date'].setValue(e.target.value);
                    let data = { value: e.target.value };
                    self.selectDate(data);
                }
            });
    
  }

  ngAfterViewChecked() {
    this.ref.detectChanges();
    this.sess =  JSON.parse(localStorage.getItem("roll"));
}

ngOnDestroy(){
    document.getElementById('clos_qual_mod_detected').click();
    document.getElementById('clos_conf').click();
}

      // Method to get Qualification Type List //
      getQualificationsList() {
        this.customService.get(get_qual_url)
            .subscribe((info: any) => {
                if(info.status != 0){
                this.qualificationTypeList[0] = info.rows.filter((item) => { return item.parent_id === 1 });
                this.qualificationTypeList[1] = info.rows.filter((item) => { return item.parent_id === 2 });
                this.duplicateQualificationTypeList = info.rows;
                this.qualificationformDetected.controls['qualification_id'].setValue(this.qualificationTypeList[0][0].id);
                }else if(info.status == 0 && info.message != "token_expired"){
                    CpdToastr.showMessage("error", info.message);
                }
            },
                err => {
                    Helpers.setLoading(false);
                    CpdToastr.showMessage("error", "Internal Server Error!");
                })
    }

        // Method to Reset Professional-Qualification Info Form//
        resetQualificationform() {
          this.add = true;
          this.formType = 'Add';
          this.sbmt_pers_btn = false;
          this.showDatepicker = false;
          this.formchanged = false;
          this.qualificationformDetected.reset();
          this.qualificationformDetected.controls['id'].setValue("");
          this.qualificationformDetected.controls.qualification_id.enable();
          this.qualificationformDetected.controls['custom'].setValue(this.customList[0].id.toString());
          this.qualificationformDetected.controls['reg_date'].setValue(this.rgst_year_date_vldtn());
          this.qualificationformDetected.controls['qualification_id'].setValue(this.qualificationTypeList[0][0].id);
      }


  // Method called on selection of Date in date-picker //
  selectDate(dateData) {
      let curr_dt = new Date();
      if (dateData.value != '' && dateData.value != "NaN/NaN/NaN") {
          this.qualificationformDetected.controls['reg_date'].setValue(dateData.value);
          let date = dateData.value.split("/");
          date = date[1] + '/' + date[0] + '/' + date[2];
          dateData = new Date(date);
          let bs_yr = this.rgst_year_date_vldtn();
          return (dateData >= bs_yr && dateData < curr_dt) ? false : true;
      }
  }

  // Method to Validate year of the Selected Date //
  rgst_year_date_vldtn() {
      let reg_dt: Date;
      let curr_dt = new Date();
      let curr_yr = curr_dt.getFullYear();
      let bs_dt = new Date(curr_yr + '-06-01');
      (curr_dt < bs_dt) ? reg_dt = new Date((curr_yr - 1) + '-06-01') : reg_dt = bs_dt;
      reg_dt.setHours(0, 0, 0);
      return reg_dt;
  }

  // Method to Validate Selected date //
  validateDate(cstm_dt: any) {
      if(this.sess!=null)
      {
        if (cstm_dt != '' && cstm_dt != "NaN/NaN/NaN") {
            var cstm_dt = $('#m_datepicker_detected').val();
            let date = cstm_dt.split("/");
            date = date[1] + '/' + date[0] + '/' + date[2];
            let curr_dt = new Date();
            cstm_dt = new Date(date);
            let curr_yr = curr_dt.getFullYear();
            let bs_yr = this.rgst_year_date_vldtn();
            let yr_vld = this.vldtn_wth_drpdwn_yr(date, this.sess);
            let year;
            let end_year;
            let start_year;
            if(this.sess!=null)
            {
                 end_year = this.sess.end_year
                 start_year = this.sess.start_year;
            }else
            {
                 end_year = curr_yr;
                 start_year = curr_yr;
            }
            if (curr_dt >= new Date("01/01/" + end_year) && curr_dt < new Date("06/01/" + end_year)) {
                year == end_year;
            }
            else {
                year = start_year;
            }
            return (year != curr_yr) ? !yr_vld : (cstm_dt >= bs_yr && cstm_dt <= curr_dt) ? false : true;
        }
      }

  }

  // Validation of Date according to selected Year //
  vldtn_wth_drpdwn_yr(slct_dt, sess) {
    if(this.sess!=null)
    {
      let curr_dt = new Date(slct_dt);
      let strt_dt = new Date('06/01/' + this.sess.start_year);
      let end_dt = new Date('06/01/' + this.sess.end_year);
      return (curr_dt >= strt_dt && curr_dt < end_dt) ? true : false;
    }
  }

  // Method called on selection of Radio Button //var
  onChange_strt_date(item) {
      if (item.id == 1) {
          this.showDatepicker = true;
          this.custom = 0;
          $('#m_datepicker_detected').datepicker({
            format: 'dd/mm/yyyy'
        }).datepicker('setDate', new Date('06-01-' + this.sess.start_year));
      } else {
          this.custom = 1;
          this.showDatepicker = false;
          $('#m_datepicker_detected').datepicker({
            format: 'dd/mm/yyyy'
        }).datepicker('setDate', new Date('06-01-' + this.sess.start_year));
      }
      this.changeDetected(item);
  }
 
  // Method called checking any chanes while closing Qualification Modal //
  detectChanges() {
      if (this.formchanged) {
          document.getElementById('conf_btn_detacted').click();
      } else {
          document.getElementById('clos_qual_mod_detected').click();
      }
  }

  // Method called to detect the changes //
  changeDetected(data?) {
      if (data) {
          this.formchanged = true;
      }
  }

    // Method to Save & Update Professional-Qualification data //
    saveQualification(data) {
        data.id="";
        this.sbmt_pers_btn = true;
        data.user_id = this.userId;
        data.programme_year_id = this.sess.id;
        data.custom = this.custom;
        let qualificationArr = [];
        if ((this.professionalInfoList.length < 10 || data.id)) {
            if (data.custom == 0) {
                data.reg_date = $('#m_datepicker_detected').val();
            } else {
                data.reg_date = '01/06/'+this.sess.start_year;
                this.qualificationformDetected.controls['reg_date'].setValue('01/06/'+this.sess.start_year);
            }
            if (this.qualificationformDetected.valid && (!this.validateDate(data.reg_date) || data.custom == 0)) {
                let not_dup_qual = true;
                for (var j = 0; j < this.professionalInfoList.length; j++) {
                    if ((!data.id && data.qualification_id == this.professionalInfoList[j].qualification_id) || (data.id && (data.qualification_id == this.professionalInfoList[j].qualification_id && data.id != this.professionalInfoList[j].id))) {
                        not_dup_qual = false;
                        break;
                    }
                }
                Helpers.setLoading(true);
                if (!data.id) {
                    qualificationArr.push(data);
                    this.customService.post(add_qual, qualificationArr)
                        .subscribe((info: any) => {
                            Helpers.setLoading(false);
                            if (info.status != 0) {
                                CpdToastr.showMessage("success", info.message);
                                this.sbmt_pers_btn = false;
                                this.getprofessionalInfo();
                                this.close_popup();
                                this.resetQualificationform();
                                location.reload();
                            }else if(info.status == 0 && info.message == "token_expired"){
                                CpdToastr.showMessage("error", "Your Session Got Expired");
                                localStorage.setItem("sessExp", "true");
                            }else {
                                CpdToastr.showMessage("error", info.message);
                            }
                        },
                            err => {
                                Helpers.setLoading(false);
                                CpdToastr.showMessage("error", "Internal Server Error!");
                            })
                } else if (data.id && not_dup_qual) {
                    data.qualification_id = this.qualificationformDetected.controls.qualification_id.value;
                    this.customService.post_wth_token(upd_user_qual, data)
                        .subscribe((info: any) => {
                            Helpers.setLoading(false);
                            if (info.status != 0) {
                                CpdToastr.showMessage("success", info.message);
                                this.add = true;
                                this.sbmt_pers_btn = false;
                                this.getprofessionalInfo();
                                this.close_popup();
                                this.resetQualificationform();
                                location.reload();
                            }else if(info.status == 0 && info.message == "token_expired"){
                                CpdToastr.showMessage("error", "Your Session Got Expired");
                                localStorage.setItem("sessExp", "true");
                            }else {
                                CpdToastr.showMessage("error", info.message);
                            }
                        },
                            err => {
                                Helpers.setLoading(false);
                                CpdToastr.showMessage("error", "Internal Server Error!");
                            })
                } else if (!not_dup_qual) {
                    document.getElementById('cls_qlf_md_detected').click();
                    CpdToastr.showMessage("error", "Same Qualification Can't Be Added Twice in a Registration Year");
                } Helpers.setLoading(false);
            } else if (!this.qualificationformDetected.valid) {
                document.getElementById('cls_qlf_md_detected').click();
            }
        }
        this.custom = 1 ;
    }

    // Method to get Professional-Qualifications Grid List //
    getprofessionalInfo() {
        Helpers.setLoading(true);
        this.loader = true;
        this.customService.get(get_prof_info + "/" + this.userId + "/" + this.sess.id)
            .subscribe((info: any) => {
                setTimeout(() => {
                    if (info.status != 0) {
                        this.professionalInfoList = info.result;
                    }else if(info.status == 0 && info.message == "token_expired"){
                        CpdToastr.showMessage("error", "Your Session Got Expired");
                        localStorage.setItem("sessExp", "true");
                    }else {
                        CpdToastr.showMessage("error", info.message);
                    }
                    Helpers.setLoading(false);
                    this.loader = false;
                }, 1500)
            },
                err => {
                    Helpers.setLoading(false);
                    CpdToastr.showMessage("error", "Internal Server Error!");
                })
    }

        // Method to close the modal pop-up //
        close_popup() {
            document.getElementById('cls_qlf_md_detected').click();
            document.getElementById('clos_qual_mod_detected').click();
            this.resetQualificationform();
        }

       // Method to open Tab according to the route //
       check_route() {
        if (JSON.parse(localStorage.getItem("no_qlf_id"))) {
            localStorage.setItem("no_qlf_id", "false");
        }
    }
	
}
