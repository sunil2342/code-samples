import { AlertService } from './../../../auth/_services/alert.service';
import { pdf_download } from './../../../auth/_constant/url.component';
import { Helpers } from './../../../helpers';
import { AlertComponent } from './../../../auth/_directives/alert.component';
import {get_cpd_data_url, get_competency,save_competency, file_url, sv_cmplt_cpd_attch, get_rol_ovr_year_url,del_competency,show_competency,usr_qlf_lst,ftch_cmplt_cpd_grd,lrn_pln } from './../../../auth/_constant/url.component';
import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { CustomService } from '../../../auth/_services/custom.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

declare var CpdToastr: any;
declare var $;
declare var Dropzone;

/* Dropzone */
import {
    DropzoneComponent, DropzoneDirective,
    DropzoneConfigInterface
} from 'ngx-dropzone-wrapper';
import { AuthenticationService } from '../../../auth/_services';
/* Dropzone */

@Component({
    selector: 'app-competencies',
    styleUrls: ['./competencies.component.scss'],
    templateUrl: 'competencies.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MyCompetencyComponent implements OnInit {

  uploadfile = true;
  /* Variable of Competency here */
  public competencyForm: FormGroup;
  gridList: any;
  imageList: any = [];
  imageListName: any = [];
  fileList: any = [];
  attachmentList: any = [];
  btn = { sbmt_btn: false };
  userId:any;
  fileLoading = false;
  formType = "Add New";
  formChange: any = false;
  user_id:any;
  ids = { del_id: null, edt_id: null };
  presentSession: any;
  rollOverList: any = [];
  yearsList: any = [];
  year: any;
  sess: any = { end_year: "", id: "", start_year: "", year_plan: "" };
  usr_qlf_lst = [];
  fileUrl:any;
  dropdownList = [];
  fulldropdownlist = [];
  progressValue: any = [];
  requirehours: any = [];
  actualhours: any = [];
  editData: any = {};
  typeDetail: any = {};
  session_year:any;
  cpdData: any = {};
  showWizardButtons = false;

  constructor(private _script: ScriptLoaderService, private authService: AuthenticationService,
                private router: Router,private _customService: CustomService, private cfr: ComponentFactoryResolver)
              {
                this.userId = JSON.parse(localStorage.getItem("currentUser")).id;
              }
 ngOnInit() {
   this._script.loadScripts('app-completed',
            ['assets/demo/default/custom/components/base/toastr.js',
                'assets/demo/default/custom/components/forms/wizard/wizard.js']);

      /* Date Picker */
       $('#start_date').datepicker({
           format: 'dd/mm/yyyy',
           todayHighlight: true,
           orientation: "bottom left",
           templates: {
               leftArrow: '<i class="la la-angle-left"></i>',
               rightArrow: '<i class="la la-angle-right"></i>'
           },
           autoclose: true
       })
       $('#expire_date').datepicker({
           format: 'dd/mm/yyyy',
           todayHighlight: true,
           orientation: "bottom left",
           templates: {
               leftArrow: '<i class="la la-angle-left"></i>',
               rightArrow: '<i class="la la-angle-right"></i>'
           },
           autoclose: true
       })
       $('#m_maxlength_1').maxlength({
           threshold: 150,
           warningClass: "m-badge m-badge--success m-badge--rounded m-badge--wide",
           limitReachedClass: "m-badge m-badge--danger m-badge--rounded m-badge--wide",
           appendToParent: true
       });
       /* Drop Down */
       $('#m_dropdown').mDropdown();
        Dropzone.autoDiscover = false;
        this.getRollOverYearList();
        this.myCompetency();
        this.get_form();
 }

 ngOnDestroy() {
     document.getElementById('clos_conf_mod').click();
     document.getElementById('close_modal_del').click();
     document.getElementById('close_modal_del_conf').click();
     document.getElementById('cls_view').click();
 }


 /* DropZone Methods Starts */
    public type: string = 'component';

    public disabled: boolean = false;

    public config: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        cancelReset: 1,

    };

    @ViewChild(DropzoneComponent,{ static: false }) componentRef: DropzoneComponent;
    @ViewChild(DropzoneDirective,{ static: false }) directiveRef: DropzoneDirective;

    public toggleType(): void {
        this.type = (this.type === 'component') ? 'directive' : 'component';
    }

    public toggleDisabled(): void {
        this.disabled = !this.disabled;
    }

    public toggleAutoReset(): void {
        this.config.autoReset = this.config.autoReset ? null : 5000;
        this.config.errorReset = this.config.errorReset ? null : 5000;
        this.config.cancelReset = this.config.cancelReset ? null : 5000;
    }

    public toggleMultiUpload(): void {
        this.config.maxFiles = this.config.maxFiles ? null : 1;
    }

    public toggleClickAction(): void {
        this.config.clickable = !this.config.clickable;
    }

    public resetDropzoneUploads(): void {
        if (this.type === 'directive') {
            this.directiveRef.reset();
        } else {
            this.componentRef.directiveRef.reset();
        }
    }
   
    // on file upload failure 
    public onUploadFile(args: any): void 
    {
        this.savefile(args);
    }
    // show kt-spinner while file progress to be upload
    onFileProgress(args) 
    {
        this.fileLoading = true;
    }
    
    // on file upload success
    public onFileUpload(args: any): void 
    {
        this.savefile(args);
    }

    // Method to Save File //
    savefile(args) {
        console.clear();
        this.resetDropzoneUploads();
        let doctype = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (doctype.indexOf(args[0].type) > -1) {
            if (args[0].size <= 5249494) {
                let formdata = new FormData();
                formdata.append('attachment', args[0]);
                this._customService.post(sv_cmplt_cpd_attch, formdata)
                    .subscribe((data: any) => {
                        if (data.status != 0) {
                            if (data.result.indexOf('jpg') > -1 || data.result.indexOf('png') > -1) {
                                this.imageList.push(file_url + data.result);
                                this.imageListName.push(data.result);
                            } else {
                                this.fileList.push(data.result);
                            }
                            this.fileLoading = false;
                            this.attachmentList.push(data.result);
                            this.competencyForm.controls['attachments'].setValue(this.attachmentList);
                            Helpers.setLoading(false);
                        } else if (data.status == 0 && data.message == "token_expired") {
                            CpdToastr.showMessage("error", "Your session has expired.");
                            localStorage.setItem("sessExp", "true");
                        } else {
                            Helpers.setLoading(false);
                            this.fileLoading = false;
                            CpdToastr.showMessage("error", data.message);
                        }
                    },
                        err => {
                            CpdToastr.showMessage("error", "Internal Server Error!");
                            this.fileLoading = false;
                            Helpers.setLoading(false);
                        })
            } else {
                Helpers.setLoading(false);
                this.fileLoading = false;
                CpdToastr.showMessage("error", "File size should not exceed 5MB");
            }

        } else {
            Helpers.setLoading(false);
            this.fileLoading = false;
            CpdToastr.showMessage("error", "Acceptable File Types - PDF,  DOC, DOCX, JPEG");
        }
    }

        // Method to Remove File//
        removeFile(index, type) {
            this.attachmentList = [];
            if (type == 'img') {
                this.imageList.splice(index, 1);
                this.imageListName.splice(index, 1);
            } else {
                this.fileList.splice(index, 1);
            }
            this.imageList.forEach(item => {
                let ind = item.lastIndexOf('/');
                let imageItem = item.slice(ind + 1);
                this.attachmentList.push(imageItem);
            });
            this.imageListName.forEach(item => {
                let ind = item.lastIndexOf('/');
                let imageItem = item.slice(ind + 1);
                this.attachmentList.push(imageItem);
            });
            this.fileList.forEach(fileItem => {
                this.attachmentList.push(fileItem)
            });
            this.competencyForm.controls['attachments'].setValue(this.attachmentList);
        }

        /* DropZone Methods Ends */
        upload() {
            $('.dropzone').click();
        }

 /* Form for Competency */
 get_form() {
     this.uploadfile = true;
     
     this.competencyForm = new FormGroup({
         id:new FormControl("", Validators.compose([])),
         title: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(150), Validators.minLength(1)])),
         start_date:new FormControl("", Validators.compose([])),
         expire_date:new FormControl("", Validators.compose([])),
         status:new FormControl("", Validators.compose([])),
         attachments:new FormControl("", Validators.compose([])),
     });
 }
  /* Method called while Opening ADD Competency Modal Pop-Up */
   openModal() {
       this.formType = "Add New";
       this.reset();
       this.competencyForm.reset();
       $("#expire_status").html("status");
   }

  // Methos to reset the forms before opening or after closing Modal Pop-Up;//
  reset() {
      this.editData = {};
      this.competencyForm.reset();
      this.imageList = [];
      this.imageListName = [];
      this.attachmentList = [];
      this.fileList = [];
      this.formChange = false;
      this.ids = { del_id: null, edt_id: null };
      this.btn.sbmt_btn = false;

  }
   // Method to detect changes //
   changeDetected() {
     this.formChange = true;
   }

   // Method called with cancel or close button in modal pop-up //
    detectChanges() {
        if (this.formChange) {
            $('#m_modal_conf').modal('show');
        } else {
            this.close_mod();
        }
    }
    // Method to close modal Pop-Up //
     close_mod()
     {
      $('.modal').modal('hide');   
     }

     /* Method to Open Minimum Qualification Modal Pop-Up */
     open_min_qlf_mdl(id) {
         setTimeout(() => {
             $(id).click();
         }, 500);
     }

    // Method to download pdf
    downloadPDF()
    {
      var user = btoa(unescape(encodeURIComponent(JSON.parse(localStorage.getItem('currentUser')).id)));
      var year= btoa(unescape(encodeURIComponent(this.sess.id)));
      var session = this.session_year;
      var url = pdf_download+'/'+user+'/'+year+'/CPDPortfolio_'+session;
      var win = window.open(url, '_blank');
      win.focus();
    }

        // Method to fetch CPD complete reports data //
        fetchCpdData() {
            this._customService.get(get_cpd_data_url + '/' + this.sess.id)
                .subscribe((info: any) => {
                    if (info.status != 0) {
                        this.cpdData = info;
                        this.progressValue = info.percentage;
                        this.session_year = info.session_year;
                    } else if (info.status == 0 && info.message != "token_expired") {
                        CpdToastr.showMessage("error", info.message);
                    }
                },
                    err => {
                        Helpers.setLoading(false);
                        CpdToastr.showMessage("error", "Either something went wrong or invalid access.");
                    })
        }
     /* Method to Navigate to Settings */
     navigate(path) {
         document.getElementById('m_modal_min_qlf_cls_btn').click();
         localStorage.setItem("no_qlf_id", 'true');
         this.router.navigate([path]);
     }

     // Methdo to Get Year List //
     getRollOverYearList() {
        this._customService.get(get_rol_ovr_year_url)
            .subscribe((info: any) => {
                if(info.status == 1){
                this.rollOverList = info.result;
                for (var i = this.rollOverList.length; i > 0; i--) {
                    this.yearsList.push(this.rollOverList[i - 1]);
                }
                let date = new Date();
                let year = date.getFullYear();
                let date2: any = "06/01" + "/" + year;
                date2 = new Date(date2);
                let session
                if (date > date2) {
                    session = this.rollOverList.filter((roll) => { return roll.start_year == year })
                } else {
                    session = this.rollOverList.filter((roll) => { return roll.end_year == year })
                }
                let sessValue = JSON.parse(localStorage.getItem("roll"));
                if (sessValue) {
                    this.selectYearSession(1,sessValue);
                } else {
                    this.presentSession = session[0].year_plan;
                    this.sess = session[0];
                }
                this.get_usr_qlf_lst();
            }else if(info.status == 0 && info.message != "token_expired"){
                CpdToastr.showMessage("error", info.message);
            }
            },
            err=>{
                Helpers.setLoading(false);
                CpdToastr.showMessage("error", "Internal Server Error!");
            })
    }

     // Method called while selecting year-period //
    selectYearSession(ind,roll) {
        this.sess = roll;
        localStorage.setItem("roll", JSON.stringify(this.sess));
        this.presentSession = roll.year_plan;
        this.get_usr_qlf_lst();
        this.fetchCpdData();
    }


     /* Method to Get User Qualification List */
     get_usr_qlf_lst() {
         Helpers.setLoading(true);
         this._customService.get(usr_qlf_lst + "/" + this.sess.id)
             .subscribe((data: any) => {
                 if (data.status != 0) {
                     this.usr_qlf_lst = data.result;
                     if (this.usr_qlf_lst.length < 1) {
                         this.open_min_qlf_mdl('#m_modal_min_qlf_btn');
                     }
                     else {
                         localStorage.setItem("no_qlf_id", 'false');
                         this.usr_qlf_lst.forEach((element, i) => {
                             this.get_lrn_pln_grd(element, i);
                         });
                     }
                 } else if (data.status == 0 && data.message != 'token_expired') {
                     CpdToastr.showMessage("error", data.message);
                 }
                 Helpers.setLoading(false);
             },
                 err => {
                     Helpers.setLoading(false);
                     CpdToastr.showMessage("error", "Internal Server Error!");
                 })
     }

     /* Method to Get Qualification's learning need */
     get_lrn_pln_grd(ele, i) {
         Helpers.setLoading(true);
         let qlf_id = ele.qualification_id;
         let prof_id = ele.professional_id;
         this._customService.get(lrn_pln + '/' + qlf_id + '/' + prof_id)
             .subscribe((data: any) => {
                 if (data.status != 0) {
                     let row = data.result;
                     this.dropdownList[i] = row;
                     row.forEach(item => {
                         this.fulldropdownlist.push(item);
                     });
                 } else if (data.status == 0 && data.message != "token_expired") {
                     CpdToastr.showMessage("error", data.message)
                 }
                 Helpers.setLoading(false)
             },
                 err => {
                     Helpers.setLoading(false);
                     CpdToastr.showMessage("error", "Internal Server Error!");
                 })
     }

    // Method called with save and continue button in pop-up //
    saveContinue(store_data) {
      this.btn.sbmt_btn = true;
      store_data.user_id = this.userId;
      store_data.status = this.returnStatus();
      store_data.start_date = this.returnStartDate();
      store_data.expire_date = this.returnExpireDate();
      Helpers.setLoading(true);
      if (this.competencyForm.valid)
      {
            this._customService.post_wth_token(save_competency,store_data)
              .subscribe((data: any) => {
                  if (data.status != 0) {
                      CpdToastr.showMessage("success", data.message);
                      this.reset();
                      Helpers.setLoading(false);
                      this.myCompetency();
                      this.close_mod();
                      $(".unsavedModal .close").click()
                  } else if (data.status == 0 && data.message == "token_expired") {
                      CpdToastr.showMessage("error", "Your session has expired.");
                      localStorage.setItem("sessExp", "true");
                  } else {
                      CpdToastr.showMessage("error", data.message);
                      Helpers.setLoading(false);
                  }
              },
                  err => {
                      Helpers.setLoading(false);
                      CpdToastr.showMessage("error", "Internal Server Error!");
                  })
      }
      Helpers.setLoading(false);
  }

  /* Method to Set to be deleted id */
  del_competency(competency_id) {
      this.ids.del_id = null;
      this.ids.del_id = competency_id;
  }

  // Method to Delete a Competency Entry //
  del_comp_grd_by_indx() {
      Helpers.setLoading(true);
      this._customService.delete(del_competency, this.ids.del_id)
          .subscribe((data: any) => {
              Helpers.setLoading(false);
              if (data.status != 0) {
                  CpdToastr.showMessage("success", data.message);
                  this.del_cncl();
                  this.myCompetency();
              } else if (data.status == 0 && data.message == "token_expired") {
                  CpdToastr.showMessage("error", "Your session has expired.");
                  localStorage.setItem("sessExp", "true");
              }
              else {
                  CpdToastr.showMessage("error", data.message);
                  this.del_cncl();
                  this.myCompetency();
              }
          },
              err => {
                  Helpers.setLoading(false);
                  CpdToastr.showMessage("error", "Internal Server Error!");
              })
  }

  // Method to Edit a Competency Entry //
  edit_competency(competency_id, actn) {
      this.reset();
      this.formType = actn;
      this._customService.get(show_competency + "/" + competency_id)
          .subscribe((info: any) => {
              if (info.status != 0) {
                  this.ids.edt_id = competency_id;
                  this.editData = info.result;
                  this.typeDetail = { value: this.editData.id};
                  if (actn == 'View') {
                      this.view_competency_entry();
                  }
                  else {
                      this.competencyForm.controls['id'].setValue(this.editData.id.toString());
                      this.competencyForm.controls['title'].setValue(this.editData.title.toString());
                      this.competencyForm.controls['start_date'].setValue(this.editData.start_date.toString());
                      this.competencyForm.controls['expire_date'].setValue(this.editData.expire_date.toString());
                      $("#expire_status").html(this.editData.status.toString());
                      this.view_competency_entry();

                  }
              } else if (info.status == 0 && info.message == "token_expired") {
                  CpdToastr.showMessage("error", "Your session has expired.");
                  localStorage.setItem("sessExp", "true");
              }
              else {
                  CpdToastr.showMessage("error", info.message)
              }
          },
              err => {
                  Helpers.setLoading(false);
                  CpdToastr.showMessage("error", "Internal Server Error!");
              });
  }

  // Method to view Competency Entry //
  view_competency_entry() {
      if (this.editData.attachments) {
          this.attachmentList = this.editData.attachments.split(',');
          this.attachmentList.forEach(attach => {
              if (attach.indexOf('jpg') > -1 || attach.indexOf('png') > -1) {
                  this.imageList.push(file_url + attach);
                  this.imageListName.push(attach);
              } else {
                  this.fileList.push(attach);
              }
          });
      }
  }

  /* Method to close Delete Modal Pop-Up */
  del_cncl() {
      document.getElementById('close_modal_del').click();
      document.getElementById('close_modal_del_conf').click();
      this.ids.del_id = null;
  }

  // Method to get start date
    setExpireDate()
    {
      if(this.getStartInputDate() !="" && this.getStartInputDate() != "/undefined/NaN")
       {
        $('#expire_date').val(this.getStartDate());
        this.getStatus(this.getStartDate());
       }else
       {
         CpdToastr.showMessage("error", "Please select start date first.");
         $("#expire_status").html("status");
       }
    }
    // Method for get start date
    getStartDate()
    {
      var start_date = (<HTMLInputElement>document.getElementById("start_date")).value;
      let _date = start_date.split("/");
      let start_ = _date[0] + '/' + _date[1] + '/' + this.oneYearPlus(_date[2]);
      return start_;
    }

    // Method for get input start date
    getStartInputDate()
    {
      var start_date = (<HTMLInputElement>document.getElementById("start_date")).value;
      let _date = start_date.split("/");
      let start_ = _date[0] + '/' + _date[1] + '/' + _date[2];
      return start_;
    }

    // Method set year + 12 months
    oneYearPlus(y)
    {
      return (Number(y)+ Number(1));
    }

    // Method to get expire or current status
    getStatus(get_date)
    {
      $("#expire_status").html("status");
      $("#expire_status").removeClass("text-success");
      $("#expire_status").removeClass("text-danger");
        let start_date = this.getStartInputDate();
        let curr_dt = new Date();
        let _date_ = get_date.split("/");
        let date__ = _date_[1] + '/' + _date_[0] + '/' + _date_[2];
        let dateData = new Date(date__);
        var expire_date_ = (<HTMLInputElement>document.getElementById("expire_date")).value;
        if(dateData < curr_dt)
        {
          $("#expire_status").html("Expired");
          $("#expire_status").removeClass("text-success");
          $("#expire_status").addClass("text-danger");
        }else
        {
          if(expire_date_ !="" && dateData > curr_dt)
          {
            $("#expire_status").html("Current");
            $("#expire_status").removeClass("text-danger");
            $("#expire_status").addClass("text-success");
          }

        }
    }

    // Method return Status
    returnStatus()
    {
      var expire_status = (<HTMLInputElement>document.getElementById("expire_status")).value;
      if(expire_status!="")
      {
        return expire_status;
      }
      else
      {
        return "Expired";
      }

    }

    // Method return Status
    returnStartDate()
    {
      var start_date = (<HTMLInputElement>document.getElementById("start_date")).value;
      if(start_date!="")
      {
      let st_date = start_date.split("/");
      return st_date[2] + '-' + st_date[1] + '-' + st_date[0];
    }
    }

    // Method return Status
    returnExpireDate()
    {
      var expire_date = (<HTMLInputElement>document.getElementById("expire_date")).value;
      if(expire_date!="")
      {
        let ex_date = expire_date.split("/");
        return ex_date[2] + '-' + ex_date[1] + '-' + ex_date[0];
      }


    }

    /* Method to Get Competencies */
       myCompetency() {
           this._customService.get(get_competency)
               .subscribe((data: any) => {
                   if (data.status != 0) {
                       this.gridList = data.result;
                   } else if (data.status == 0 && data.message == "token_expired") {
                       CpdToastr.showMessage("error", "Your session has expired.");
                       localStorage.setItem("sessExp", "true");
                   }
                   else {
                       CpdToastr.showMessage("error", data.message)
                   }
               },
                   err => {
                       Helpers.setLoading(false);
                       CpdToastr.showMessage("error", "Internal Server Error!");
                   })
           Helpers.setLoading(false);
       }

       /* Method Show Validation Message */
       showAlert(target) {
           this[target].clear();
           let factory = this.cfr.resolveComponentFactory(AlertComponent);
           let ref = this[target].createComponent(factory);
           ref.changeDetectorRef.detectChanges();
       }

       // Method to detect changes start date //
    changeExpireDetected() {
        this.formChange = true;
        var new_start_ = this.getStartInputDate()
        let new_date_ = new_start_.split("/");
        let new_date__ = new_date_[1] + '/' + new_date_[0] + '/' + new_date_[2];
        var new_curr_dt_ = new Date(new_date__);
        var _expire_date_ = (<HTMLInputElement>document.getElementById("expire_date")).value;
        var exp_date_ = _expire_date_.split("/");
        let exp_date__ = exp_date_[1] + '/' + exp_date_[0] + '/' + exp_date_[2];
        var dateData_ = new Date(exp_date__);
        setTimeout(() => {
          this.getStatus(_expire_date_);
          this.changeExpireDetected();
        }, 1000);
    }

    // Method to detect changes start date //
   changeDetectedDate() {
       this.formChange = true;
       $('#expire_date').val("");
       $("#expire_status").html("status");
   }
   //Method to open files in new tab for preview
   OpenFile(fileName)
   {
     var url = file_url + fileName;
     var win = window.open(url, '_blank');
     win.focus();
     var win = window;
   }


}
