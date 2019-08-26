/* Methods
  /(for get content of masters)
  save

*/
/* Include Modules */
var express = require( 'express' );
var router = express.Router();
var url = require( 'url' );

/* Include Database connection and functions */
var connection = require('../../config');
var lib = require('../../app_config');
var ObjectID = require('mongodb').ObjectID;
var moment = require("moment-timezone");
var schedule = require('node-schedule');
moment.tz.setDefault("Asia/Kolkata");
var zone = "Asia/Kolkata";
var now = new Date();
//var current_date = moment.tz(now, zone).format('YYYY-MM-DDTHH:mm:ss.SSS');

var current_date_new = new Date();
var current_date = new Date(current_date_new.getTime() + (+5.30*60*60*1000));
//var bodyParser = require( 'body-parser' );
//router.use(bodyParser.json());
//var multer          =       require('multer');
//router.use(bodyParser.urlencoded({"extended" : true}));

/* GET content of marters */
router.post('/add', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime() + (+5.30*60*60*1000));
    var response = {};
    var title = req.body.title;
    var description = req.body.description;
    var logo_url = req.body.logo_url;
    var top_nav_bar_color = req.body.top_nav_bar_color;
    var user_id = req.body.user_id;
    var client_id = req.body.client_id;
    var font_colour = req.body.font_colour;
    var settings_data_arr = {};
   /*if(lib.is_not_empty(title) && lib.is_not_empty(description) && lib.is_not_empty(logo_url) && lib.is_not_empty(top_nav_bar_color))
   {*/
      settings_data_arr['title'] = title;
      settings_data_arr['description'] = description;
      settings_data_arr['status'] = 'active';
      settings_data_arr['logo_url'] = logo_url;
      settings_data_arr['top_nav_bar_color'] = top_nav_bar_color;
      settings_data_arr['font_colour'] = font_colour;
      settings_data_arr['created'] = current_date;
      settings_data_arr['modified'] = current_date;
      
      var settings_arrr = {};
      if(lib.is_not_empty(client_id)){
        settings_arrr['client_id'] = new ObjectID(client_id);
        settings_data_arr['client_id'] = new ObjectID(client_id);
      }else{
        settings_arrr['client_id'] = "";
        settings_data_arr['client_id']="";
      }
      connection.settings.find(settings_arrr,function(err,settings_data){

      
        if(lib.is_not_empty(settings_data) && settings_data.length>0){

           connection.settings.update( { '_id' : new ObjectID(settings_data[0]['_id']) }, { '$set' : settings_data_arr }, { upsert: true }, function( err_update, result_update ) {

                response['authCode'] = apps_success_code;
                response['authMessage'] = setting_saved;
                response['last_insert_id'] = settings_data[0]['_id'];
               // console.log(response);
                res.json(response);
           });
        }else{

            var save_apps_data_connection = connection.settings(settings_data_arr);
            save_apps_data_connection.save( function( err, result ) {

              response['authCode'] = apps_success_code;
              response['authMessage'] = setting_saved;
              response['last_insert_id'] = result._id;
             // console.log(response);
              res.json(response);

          });
        }

     });
      
     
  /*}else{
      response['authCode'] = apps_error_code;
      response['authMessage'] = choose_fields;
      response['params'] = choose_fields;
      res.json(response);      
  }*/

});
router.get('/', function(req, res, next) {
  
  var response  = {};
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+5.30*60*60*1000));
  var client_id = req.headers.client_id;
  var settings_arr = {};
  var settings_arr_client = {};
  if(lib.is_not_empty(client_id)){
    
    settings_arr['client_id'] = new ObjectID(client_id);
    settings_arr_client['_id'] = new ObjectID(client_id);
  }
  var settings_arr_data = [];
  connection.settings.find(settings_arr,function(err,settings_data){
      
      connection.account_users.find(settings_arr_client,function(errss,client_data){

            
              var client_name="";
              if(lib.is_not_empty(client_data)){
                client_name = client_data[0]['title'];
              }
             if(lib.is_not_empty(settings_data) && settings_data.length>0){
                  
                  settings_arr_data[0] = {
                  
                    'setting_id':settings_data[0]['_id'],
                    'title':settings_data[0]['title'],
                    'description':settings_data[0]['description'],
                    'status':settings_data[0]['status'],
                    'logo_url':settings_data[0]['logo_url'],
                    'top_nav_bar_color':settings_data[0]['top_nav_bar_color'],
                    'font_colour':settings_data[0]['font_colour'],
                    'client_name':client_name,
                    'client_id':settings_data[0]['client_id'],
                    'created':settings_data[0]['created'],
                    'modified':settings_data[0]['modified']
                  };
                  response['authCode'] = apps_success_code;
                  response['authMessage'] = setting_fetch;
                  response['params'] = settings_arr_data;
                  res.json(response);
              }else{

                  response['authCode'] = apps_error_code;
                  response['authMessage'] = settings_not;
                  response['params'] = settings_not;
                  res.json(response);

              }

              


      });
  });
});
module.exports = router;