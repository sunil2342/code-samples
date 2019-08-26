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
  var md5 = require('md5');
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
  var aws = require('aws-sdk');
  aws.config.loadFromPath('././config.json');
  //var multer          =       require('multer');
  //router.use(bodyParser.urlencoded({"extended" : true}));

  /* GET content of marters */

  router.post('/add', function(req, res, next) {

      var current_date_new = new Date();
      var current_date = new Date(current_date_new.getTime() + (+5.30*60*60*1000));
      
      var first_name = req.body.first_name;
      var last_name = req.body.last_name;
      var email_address = req.body.email_address;
      var password = req.body.password;
      var contact_number = req.body.contact_number;
      var notify = req.body.notify;
      var client_status = req.body.client_status;
      var title = req.body.title;
      var created_by = new ObjectID(req.body.created_by);

      
      var response = {};
      var user_data_arr = {};
      if(lib.is_not_empty(first_name) && lib.is_not_empty(last_name) && lib.is_not_empty(password) && lib.is_not_empty(email_address) && lib.is_not_empty(contact_number) && lib.is_not_empty(notify) && lib.is_not_empty(client_status))
      {
          var permissions = {
              "apps" : {
                  "view" : true,
                  "action" : true
              },
              "overview" : {
                  "view" : true
              },
              "app_users" : {
                  "view" : true
              },
              "data" : {
                  "view" : true
              },
              "reports" : {
                  "view" : true
              },
              "action" : {
                  "view" : true,
                  "action" : true
              },
              "monitoring" : {
                  "view" : true,
                  "action" : true
              },
              "events" : {
                  "view" : true,
                  "action" : true
              },
              "users" : {
                  "view" : true,
                  "action" : true
              },
              "manage_settings" : {
                  "view" : true,
                  "action" : true
              }
          };
          var slug = lib.getSlug(title);
          var rand_slug = lib.random_getSlug(title);
          connection.account_users.find({'slug':slug,'status':'active'},function(errors,slug_exists){
          user_data_arr['slug'] = slug;
          if(slug_exists.length>0)
          {
            user_data_arr['slug'] = rand_slug;
          }
          user_data_arr['title'] = title;
          user_data_arr['first_name'] = first_name;
          user_data_arr['last_name'] = last_name;
          user_data_arr['email_address'] = email_address;
          user_data_arr['contact_number'] = contact_number;
          user_data_arr['client_status'] = client_status;
          user_data_arr['notify'] = notify;
          user_data_arr['password'] = md5(password);
          user_data_arr['email_address'] = email_address;
          user_data_arr['status'] = 'active';
          user_data_arr['user_type'] = 'c_s_admin';
          user_data_arr['created_by'] = created_by;
          user_data_arr['permissions'] = permissions;
          user_data_arr['created'] = current_date;
          user_data_arr['modified'] = current_date;

          save_user_data(user_data_arr);
        });

      }else{
        empty_data_validation()
      }

     function save_user_data(user_data_arr)
     {
          connection.account_users.find({'title':title,'status':'active'},function(errors,client_name_exists){
              if(client_name_exists.length>0)
              {
                response['authCode'] = apps_error_code;
                response['authMessage'] = client_name;
                response['params'] = client_name;
                res.json(response);

              }else{
                    connection.account_users.find({'email_address':email_address,'status':'active'},function(err,email_exist){
                      if(email_exist.length>0)
                      {
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = email_exist_data;
                        response['params'] = email_exist_data;
                        res.json(response);

                      } else {

                          var rand_number = ""+Math.floor((Math.random() * 10000000) + 1)+"";
                          rand_number = rand_number.slice(1,4);
                          var username_split = email_address.split("@");
                          var user_last_name = username_split[1].split('.');
                          var username_str = username_split[0].slice(0,4)+rand_number;
                          user_data_arr['username'] = username_str;

                          var save_users_data_connection = connection.account_users(user_data_arr);
                          save_users_data_connection.save( function( err, result_data) {

                              var account_data_arr = {};
                              account_data_arr['client_id'] = new ObjectID(result_data._id);

                               connection.account_users.update( { '_id' : new ObjectID(result_data._id) }, { '$set' : account_data_arr }, { upsert: true }, function( err_updates, result_updates ) {
                                  //set by deafult color
                                  var settings_arr = {};
                                  settings_arr['top_nav_bar_color'] = '#F7F7F7';
                                  settings_arr['font_colour'] = '#5A565A';
                                  settings_arr['status'] = 'active';
                                  settings_arr['client_id'] = new ObjectID(result_data._id);

                                  var save_users_data_connection = connection.settings(settings_arr);
                                  save_users_data_connection.save( function( err, result_data) {
                                      
                                      if( notify=="true" ) {
  
                                          var ses = new aws.SES({apiVersion: '2010-12-01'});
                                          var to = [email_address];   // result[0]['email']
                                          var from = 'Monitics<monitics@wedigtech.com>';
                                          var replyTo = 'Monitics<monitics@wedigtech.com>';

                                          ses.sendEmail({

                                             Source: from, 
                                             Destination: { ToAddresses: to },
                                             Message: {
                                              Subject: {
                                               Data: 'Monitics Client Registration'
                                              },
                                              Body: {
                                               Html: {
                                                Data: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Analytics</title></head><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="#ff000" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:20px; width:auto;"><span style=" font-family:Arial, Helvetica, sans-serif; font-size:24px; margin-top:0;  margin-left:10px; float:left; font-waight:600; padding:0 0 0; width:100%; text-align:left;">Monitics Services</span> </a></td></tr><tr><td style="padding:15px 30px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042; " colspan="2">Hello,</td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">Congratulations! Your account is successfully created for '+first_name+' '+last_name+' app.</td></tr><tr><td width="70%"><div style="font-size:14px; color:#01b84e; display:block; margin:0px 0 5px; font-weight:bold;">Monitics Services</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;"><a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">http://analyticsapp.com</a></p><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">For any further assistance please e-mail us at <a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">support@analyticsapp.com</a></p></td><td width="30%"><div style="float:right;"></div></td></tr></table></td></tr></table></body></html>',
                                               }
                                              }
                                             }
                                            }, function(err, data) {
                                          });
                                      }
                                      response['authCode'] = apps_success_code;
                                      response['authMessage'] = client_data;
                                      response['params'] = client_data;
                                      res.json(response);
                                  
                                  });
                             });
                          
                          });

                      }
                    });
              }
          });
     }
    function empty_data_validation()
    {
      if(!lib.is_not_empty(first_name))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_first_name;
        response['params'] = empty_first_name;
        res.json(response);
      }else if(!lib.is_not_empty(last_name))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_last_name;
        response['params'] = empty_last_name;
        res.json(response);
      }else if(!lib.is_not_empty(email_address))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_email_address;
        response['params'] = empty_email_address;
        res.json(response);
      }else if(!lib.is_not_empty(contact_number))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_contact;
        response['params'] = empty_contact;
        res.json(response);
      }else if(!lib.is_not_empty(notify))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = notify;
        response['params'] = notify;
        res.json(response);
      }else if(!lib.is_not_empty(client_status))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = is_enabled;
        response['params'] = is_enabled;
        res.json(response);
      }
    }

  });


 router.get('/', function(req, res, next) {

        var current_date_new = new Date();
        var current_date = new Date(current_date_new.getTime() + (+5.30*60*60*1000));
        var item_per_page = parseInt(req.headers.item_per_page);
        var offset = (req.headers.offset-1)*item_per_page;
        var sort_by = req.headers.sort_by;
        var order_by = parseInt(req.headers.order_by);
        var skip=item_per_page+parseInt(offset);
        var search_string = req.headers.search_string;
        var response = {};
        var like_query_statement = [
                          {second_created:parseInt(search_string)},
                          {year_created:parseInt(search_string)},
                          {month_created:parseInt(search_string)},
                          {hour_created:parseInt(search_string)},
                          {minute_created:parseInt(search_string)},
                          {day_created:search_string},
                          //Find data by modfied date

                          {day_modified:parseInt(search_string)},
                          {second_modified:parseInt(search_string)},
                          {year_modified:parseInt(search_string)},
                          {month_modified:parseInt(search_string)},
                          {hour_modified:parseInt(search_string)},
                          {minute_modified:search_string},

                          {'username':{'$regex':search_string,$options: '-i'}},
                          {'email_address':{'$regex':search_string,$options: '-i'}},
                          {'last_name':{'$regex':search_string,$options: '-i'}},
                          {'first_name':{'$regex':search_string,$options: '-i'}},
                          {'contact_number':{'$regex':search_string,$options: '-i'}},
                          {'title':{'$regex':search_string,$options: '-i'}}
                        ];
        var query_statement;
        if(lib.is_not_empty(search_string)){

          query_statement = {$and:[{'status':'active','user_type':'c_s_admin'}],$or:like_query_statement};
        }else{
          query_statement = {$and:[{'status':'active','user_type':'c_s_admin'}]};
        }
        connection.account_users.count(query_statement,function(err,count){
          app_event_users_data(count);
        });
        function app_event_users_data(count)
        {
          var insensitive_new;
          var sort_by_new;
          if(sort_by=='_id'){
            
            insensitive_new = {
                $project:{
                  '_id':1,'username':1,'first_name':1,'last_name':1,'title':1,'notify':1,'client_status':1,'email_address':1,'status':1,'modified':1,'created':1,'contact_number':1,'user_type':1,'insensitive':1
                }
              };
            sort_by_new = sort_by;
          
          }else{
            insensitive_new = {
                $project:{
                  '_id':1,'username':1,'first_name':1,'user_type':1,'last_name':1,'title':1,'notify':1,'client_status':1,'email_address':1,'status':1,'modified':1,'created':1,'contact_number':1,'insensitive':1,insensitive: { "$toUpper": "$"+sort_by}
                }
              };
              sort_by_new = "insensitive";
          }
          var sort_data = { [sort_by_new]: order_by};
           var query_sort_data = [
              insensitive_new,
               { "$sort":sort_data}, 
              {
                $match:query_statement,
            },
              { $limit : skip},
              {$skip:offset},
            ];
            connection.account_users.aggregate(query_sort_data,function(err,data){

              var client_data_arr = [];
              var event_key = 0;
              function app_event_user_data_fun(event_key)
              {
                if(lib.is_not_empty(data) && event_key<data.length)
                {
                    var modified = data[event_key]['modified'];
                    modified = modified.toISOString();
                    modified = modified.split('.')[0].replace('T', ' ');
                    var modified_on = date_format(modified, "dd mmmm,yy hh:MM TT");
                    //created date
                    var created_date_on = data[event_key]['created'];
                    created_date_on = created_date_on.toISOString();
                    created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                    var created_on = date_format(created_date_on, "dd mmmm,yy hh:MM TT");
                    client_data_arr[event_key] = {

                      'client_id':data[event_key]['_id'],
                      'title':data[event_key]['title'],
                      'first_name':data[event_key]['first_name'],
                      'last_name':data[event_key]['last_name'],
                      'email_address':data[event_key]['email_address'],
                      'contact_number':data[event_key]['contact_number'],
                      'notify':data[event_key]['notify'],
                      'client_status':data[event_key]['client_status'],
                      'created_on':created_on,
                      'modified':modified_on
                    };
                    event_key++;
                    app_event_user_data_fun(event_key);

                }else{

                      if(lib.is_not_empty(client_data_arr))
                      {
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = fetch_data;
                        response['params'] = client_data_arr;
                        response['total_count'] = count;
                        res.json(response);
                      
                      }else{
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = recent_user_not;
                        response['params'] = recent_user_not;
                        res.json(response);
                      }
                   
                }

              }

              app_event_user_data_fun(event_key);
            })

        }
   
 });

  module.exports = router;