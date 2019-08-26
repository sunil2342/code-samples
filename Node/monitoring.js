/* Methods
  /(for get content of masters)
  save

*/
/* Include Modules */
var express = require( 'express' );
var router = express.Router();
var url = require( 'url' );
var request = require('request');

/* Include Database connection and functions */
var connection = require('../../config');
var lib = require('../../app_config');
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
var aws = require('aws-sdk');
aws.config.loadFromPath('././config.json');
var moment = require("moment-timezone");
var schedule = require('node-schedule');
moment.tz.setDefault("Asia/Kolkata");
var zone = "Asia/Kolkata";
var now = new Date();
//var bodyParser = require( 'body-parser' );
//router.use(bodyParser.json());
var current_date_new = new Date();
var current_date = new Date(current_date_new.getTime());
//var multer          =       require('multer');
//router.use(bodyParser.urlencoded({"extended" : true}));
/* GET content of marters */
router.post('/add', function(req, res, next) {

  var response = {};
  if(lib.is_not_empty(req.body.user_id) && lib.is_not_empty(req.body.app_id))
  {
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var app_id = new ObjectID(req.body.app_id);
    var title = req.body.title;
    var type = req.body.type;
    var details = req.body.details;
    var service_status = req.body.service_status;
    var action = req.body.action;
    var email_address = req.body.email_address;
    var user_id = new ObjectID(req.body.user_id);

    function random_event_func()
    {
        var operator_data_arr = {};
        operator_data_arr['title'] = title;
        operator_data_arr['action'] = action;
        operator_data_arr['app_id'] = app_id;
        operator_data_arr['user_id'] = user_id;
        operator_data_arr['service_status'] = service_status;
        operator_data_arr['status'] = 'active';
        operator_data_arr['type'] = type;
        operator_data_arr['details'] = details;
        operator_data_arr['email_address'] = email_address;
        operator_data_arr['created'] = current_date;
        operator_data_arr['modified'] = current_date;
        //res.send(operator_data_arr);
        connection.monitoring.find({'app_id':app_id,'status':'active','title':title},function(err,monitor_name_exist){

              if(monitor_name_exist.length>0)
              {
                  response['authCode'] = apps_error_code;
                  response['authMessage'] = monitor_name_exist_data;
                  response['params'] = monitor_name_exist_data;
                  res.json(response);

              }else{
                var save_events_data_connection = connection.monitoring(operator_data_arr);
                save_events_data_connection.save( function( err, result ) {

                      response['authCode'] = apps_success_code;
                      response['authMessage'] = monitoring_saved;
                      response['params'] = monitoring_saved;
                      res.json(response);

                });
              }
        });
    }
    random_event_func('');
  }else{

      if(!lib.is_not_empty(user_id))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_user_id;
        response['params'] = empty_user_id;
        res.json(response);

      }else if(!lib.is_not_empty(app_id)){
            
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_event_app;
        response['params'] = empty_event_app;
        res.json(response);
      }
  }

});

router.put('/:monitor_id', function(req, res, next) {

  var response = {};
  if(lib.is_not_empty(req.body.user_id) && lib.is_not_empty(req.body.app_id) && lib.is_not_empty(req.params.monitor_id))
  {
      var current_date_new = new Date();
      var current_date = new Date(current_date_new.getTime());

      var monitor_id = req.params.monitor_id;
      var app_id = new ObjectID(req.body.app_id);
      var title = req.body.title;
      var type = req.body.type;
      var details = req.body.details;
      var service_status = req.body.service_status;
      var action = req.body.action;
      var email_address = req.body.email_address;
      var user_id = new ObjectID(req.body.user_id);

      
      function random_event_func()
      {
          var operator_data_arr = {};
          operator_data_arr['title'] = title;
          operator_data_arr['action'] = action;
          operator_data_arr['app_id'] = app_id;
          operator_data_arr['user_id'] = user_id;
          operator_data_arr['service_status'] = service_status;
          operator_data_arr['status'] = 'active';
          operator_data_arr['type'] = type;
          operator_data_arr['details'] = details;
          operator_data_arr['email_address'] = email_address;
          operator_data_arr['created'] = current_date;
          operator_data_arr['modified'] = current_date;
          //res.send(operator_data_arr);
          connection.monitoring.find({'_id':{$ne:monitor_id},'app_id':app_id,'title':title,'status':'active'},function(err,monitor_name_exist){

            if(lib.is_not_empty(monitor_name_exist) && monitor_name_exist.length>0)
            {
                response['authCode'] = apps_error_code;
                response['authMessage'] = monitor_name_exist_data;
                response['params'] = monitor_name_exist_data;
                res.json(response);

            }else{

                connection.monitoring.update( { '_id' : new ObjectID(monitor_id) }, { '$set' : operator_data_arr }, { upsert: true }, function( err_update, result_update ) {
                      
                      response['authCode'] = apps_success_code;
                      response['authMessage'] = monitoring_update;
                      response['params'] = monitoring_update;
                      res.json(response);
                });
            }
          });
      }
      random_event_func('');
  }else{

      if(!lib.is_not_empty(user_id))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_user_id;
        response['params'] = empty_user_id;
        res.json(response);
      }else if(!lib.is_not_empty(monitor_id))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_monitor_id;
        response['params'] = empty_monitor_id;
        res.json(response);
      }else if(!lib.is_not_empty(app_id)){
            
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_event_app;
        response['params'] = empty_event_app;
        res.json(response);
      }
  }
});

/*router.delete('/:monitor_id', function(req, res, next) {
  var response = {};

    var monitor_id = req.params.monitor_id;
    
    var operator_data_arr = {};
    operator_data_arr['status'] = 'inactive';
    operator_data_arr['modified'] = current_date;
    //res.send(operator_data_arr);
    
       connection.monitors.update( { '_id' : new ObjectID(monitor_id) }, { '$set' : operator_data_arr }, { upsert: true }, function( err_update, result_update ) {

            response['authCode'] = apps_success_code;
            response['authMessage'] = delete_monitor_data;
            response['params'] = delete_monitor_data;
            res.json(response);

      });

});*/
router.get('/:app_id', function(req, res, next) {
    
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var app_id = req.params.app_id;
    var sort_by = req.headers.sort_by;
    var item_per_page = req.headers.item_per_page;
    var order_by = parseInt(req.headers.order_by);
    if(req.headers.offset!=0)
    {
     var offset = (req.headers.offset-1)*item_per_page; 
    }else{
     var offset = 0;
    }
    var skip=parseInt(item_per_page)+parseInt(offset);
    if(lib.is_not_empty(sort_by) && lib.is_not_empty(order_by))
    {
      var response = {};
      var monitor_key = 0;
      var monitor_arr = [];
      var monitor_data_query = [
                  {
                    $project:
                    {
                      //find value for created date
                      '_id':1,'title':1,'action':1,'service_status':1,'details':1,'type':1,'status':1,'email_address':1,'app_id':1,'user_id':1,'created':1,'modified':1,'insensitive':1,
                      insensitive: { "$toUpper": "$"+sort_by}
                    }
                  },      
                  {
                    $match:{
                      $and:[{'status':'active'},{'app_id':new ObjectID(app_id)}],
                    }   
                  },
                  { "$sort": { "insensitive": order_by} },
                  { $limit : skip},
                  {$skip:offset}
              ];
      var monitor_data_query_count = {'app_id':new ObjectID(app_id),'status':'active'};

      connection.monitoring.count(monitor_data_query_count,function(err,monitor_data_count){

        monitor_data_count_function(monitor_data_count);

      })
      function monitor_data_count_function(monitor_data_count)
      {
        connection.monitoring.aggregate(monitor_data_query,function(err,monitor_data_exist){


            function monitor_data(monitor_key)
            {
              if(lib.is_not_empty(monitor_data_exist) && monitor_key<monitor_data_exist.length){

                    monitor_arr[monitor_key] = {

                      "monitor_id":monitor_data_exist[monitor_key]['_id'],
                      "title":monitor_data_exist[monitor_key]['title'],
                      "type":monitor_data_exist[monitor_key]['type'],
                      "action":monitor_data_exist[monitor_key]['action'],
                      "service_status":monitor_data_exist[monitor_key]['service_status'],
                      "user_id":monitor_data_exist[monitor_key]['user_id'],
                      "email_address":monitor_data_exist[monitor_key]['email_address'],
                      "details":monitor_data_exist[monitor_key]['details'],
                    };
                    //console.log(monitor_arr);
                    //evnt_data_found(monitor_arr);
                    event_data_query();
              }else{
                  //res.send(monitor_arr);
                  if(monitor_arr.length>0)
                  {
                    response['authCode'] = apps_success_code;
                    response['monitor_data_count']=monitor_data_count;
                    response['authMessage'] = fetch_data;
                    response['params'] = monitor_arr;
                    res.json(response);
                  }else{
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = monitor_not_found;
                    response['params'] = monitor_not_found;
                    res.json(response);
                  }
              }
            }
            function event_data_query()
            {
              monitor_key++;
              monitor_data(monitor_key);
            }
             monitor_data(monitor_key);
        })/*.sort({ created : -1 }).skip(offset).limit(item_per_page);*/
      }
    }else{
             response['authCode'] = apps_error_code;
             response['authMessage'] = empty_sort_order_by;
             response['params'] = empty_sort_order_by;
             res.json(response);
    }
});

router.delete('/', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var response = {};
    var monitor_id_str = req.headers.monitor_id_str;
    var monitor_data_arr = {};
    var monitor_user_arr = monitor_id_str.split(',');
    if(lib.is_not_empty(monitor_user_arr))
    {
        for(i=0;i<monitor_user_arr.length>0;i++)
        {
          monitor_data_arr['status'] = 'inactive';
          monitor_data_arr['modified'] = current_date;
         //console.log(account_user_arr[i]);
          connection.monitoring.update( { '_id' : new ObjectID(monitor_user_arr[i]) }, { '$set' : monitor_data_arr }, { upsert: true }, function( err_update, result_update ) {
          
          });

        }

       response['authCode'] = apps_success_code;
       response['authMessage'] = Data_delete;
       response['params'] = Data_delete;
       res.json(response);
    }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = delete_id_str_event;
        response['params'] = delete_id_str_event;
        res.json(response);
    }
});

router.get('/monitor/:monitor_id', function(req, res, next) {
  
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());

  var response = {};
  var monitor_id = req.params.monitor_id;
  var monitor_key = 0;
  var monitor_arr = [];

  connection.monitoring.find({'_id':new ObjectID(monitor_id),'status':'active'},function(err,monitor_data_exist){

      function monitor_data(monitor_key)
      {
        if( monitor_key<monitor_data_exist.length ){


              monitor_arr[monitor_key] = {

                      "monitor_id":monitor_data_exist[monitor_key]['_id'],
                      "title":monitor_data_exist[monitor_key]['title'],
                      "type":monitor_data_exist[monitor_key]['type'],
                      "action":monitor_data_exist[monitor_key]['action'],
                      "service_status":monitor_data_exist[monitor_key]['service_status'],
                      "user_id":monitor_data_exist[monitor_key]['user_id'],
                      "email_address":monitor_data_exist[monitor_key]['email_address'],
                      "details":monitor_data_exist[monitor_key]['details'],
                    };
              //console.log(monitor_arr);
              //evnt_data_found(monitor_arr);
              event_data_query();

        }else{
              
              if(monitor_arr.length>0)
              {
                  response['authCode'] = apps_success_code;
                  response['authMessage'] = fetch_data;
                  response['params'] = monitor_arr;
                  res.json(response);
              }else{
                  response['authCode'] = apps_error_code;
                  response['authMessage'] = monitor_not_found;
                  response['params'] = monitor_not_found;
                  res.json(response);
              }

        }
      }
      function event_data_query()
      {
        monitor_key++;
        monitor_data(monitor_key);
      }
       monitor_data(monitor_key);
  });
});

router.post('/connection_api/:type/:service_type', function(req, res, next) {

	var data = req.body;
	var app_id = data.type;
	var connectionType = data.type;
	var service_type = req.params.service_type;
	var details = data.details;
	var host = details.host; 
	var username = details.username;
	var password = details.password;  
	var title = data.title;
	var filePath =details.filePath;
	var fileName =details.fileName;
	var url = filePath;
	var port_type = details.port_type;
	var portnumber = details.port_type;
	var minPortNo = details.minPortNo;
	var maxPortNo =  details.maxPortNo;
	var multiple_port_no =details.multiple_port_no;


	/*var app_id = '59eeee73bc88e5777e006a0e';
	var connectionType = 'SSH';
	var service_type = 'start';
	//var details = data.details;
	var host = '52.168.92.204';
	var username = 'wedigtech';
	var password = 'wedigtech@1234';
	var title = 'YMD4 - Node service';
	var filePath ='/var/www/html/rbapi/';
	var fileName ='MainApi.js';
	var port_type = 'range';
	var portnumber = '3004';
	var minPortNo = '3000';
	var maxPortNo =  '3009';
	var multiple_port_no = [{"port_no":3004},{"port_no":3007},{"port_no":3009}];
	var url = filePath;*/


	var exec = require('node-ssh-exec'); 
	var response = {}; 
	
	if(connectionType == 'SSH'){    
		
		if(service_type=='start' || service_type=='restart'){
      
      
			
      if(port_type == 'range'){

				var config_start = {
					username: username,
					host: host,   
					password: password
				},
				command_stop = 'cd '+url+' && echo '+password+' | sudo -S forever stop '+fileName; 
				exec(config_start, command_stop, function (error, responseAPI) {
					if (error) {
						response['authCode'] = apps_error_code;
						response['authMessage'] = error.level;
						response['params'] = error;
						res.json(response);
					}else{

						var key = minPortNo;
						function run_commands( key ) {

							if( key <= maxPortNo ) {
								
								command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+key;	
								console.log(command_start);                       
								exec(config_start, command_start, function (error, responseAPI) {
									
									key++;
									run_commands( key );	         	 
								});
							} else {
								
								response['authCode'] = apps_success_code;
								response['authMessage'] = 'Connection Started by Admin manually';
								response['params'] =  'Connection Started by Admin manually';

                var message;
                if( service_type=='start' ) {

                  message = 'is started by admin manually';
                  send_stop_start_email(data , message, 'started' );
                    
                }else if(service_type=='restart'){

                    message = 'is restarted by admin manually';
                    send_stop_start_email(data , message, 'restarted' );
                    
                }
								res.send(response);
							}
						}
						run_commands( key );			      
					}
				});
			}else if(port_type == 'single'){

				var config_start = {
					username: username,
					host: host,   
					password: password
				},
				command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+portnumber;  
				exec(config_start, command_start, function (error, responseAPI) {	
					
					if (error) {
						
						response['authCode'] = apps_error_code;
						response['authMessage'] = error.level;
						response['params'] = error;
						res.json(response);
					}else{
						
						response['authCode'] = apps_success_code;
						response['authMessage'] = 'Connection Started by Admin manually';
						response['params'] =  'Connection Started by Admin manually';
						res.send(response);

						 var message;
			                if( service_type=='start' ) {

			                  message = 'is started by admin manually';
			                  send_stop_start_email(data , message, 'started' );
			                    
			                }else if(service_type=='restart'){

			                    message = 'is restarted by admin manually';
			                    send_stop_start_email(data , message, 'restarted' );
			                    
			                }
					}		         	 
				});
			}else if(port_type == 'multiple'){

				var config_start = {
					username: username,
					host: host,   
					password: password
				},
				command_stop = 'cd '+url+' && echo '+password+' | sudo -S forever stop '+fileName; 
				exec(config_start, command_stop, function (error, responseAPI) {
					if (error) {
						
						response['authCode'] = apps_error_code;
						response['authMessage'] = error.level;
						response['params'] = error;
						res.json(response);
					}else{	            		

						var key = 0;
						function run_commands( key ) {

							if( key < multiple_port_no.length ) {
								
								command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+multiple_port_no[key]['port_no'];	
								//console.log(command_start);                       
								exec(config_start, command_start, function (error, responseAPI) {
									
									key++;
									run_commands( key );	         	 
								});
							} else {
								
								response['authCode'] = apps_success_code;							
								response['authMessage'] = 'Connection Started by Admin manually';
								response['params'] =  'Connection Started by Admin manually';

								 var message;
				                if( service_type=='start' ) {

				                  message = 'is started by admin manually';
				                  send_stop_start_email(data , message, 'started' );
				                    
				                }else if(service_type=='restart'){

				                    message = 'is restarted by admin manually';
				                    send_stop_start_email(data , message, 'restarted' );
				                    
				                }
								
								res.send(response);
							}
						}
						run_commands( key );
					}
				});
			}       
		}else if(service_type=='stop'){

			var config_stop = {
				username: username,
				host: host,   
				password: password
			},
			command_stop = 'cd '+url+' && echo '+password+' | sudo -S forever stop '+fileName; 
			exec(config_stop, command_stop, function (error, responseAPI) {         	 
				if (error) {
					
					response['authCode'] = apps_error_code;
					response['authMessage'] = error.level;
					response['params'] = error;
					res.json(response);
				}else{

					message = 'is stopped by admin manually';
         			 send_stop_start_email(data , message, 'stopped' );

					response['authCode'] = apps_success_code;
					response['authMessage'] = 'Connection stopped by Admin manually';
					response['params'] =  'Connection stopped by Admin manually';
					res.send(response);
				}
			});
		}

	}else{

		response['authCode'] = apps_error_code;
		response['authMessage'] = SSH_NOT_AVAILABLE;
		response['params'] = SSH_NOT_AVAILABLE;
		res.json(response);
	}
});

  function send_stop_start_email( data, message ,service_type) {

      var email_address_str = data.email_address;
      var email_address_arr = email_address_str.split(",");
      console.log(email_address_arr);
      if( lib.is_not_empty(email_address_arr) ) {
      
        for( var i=0; i<email_address_arr.length; i++ ) {
        
          var ses = new aws.SES({apiVersion: '2010-12-01'});
          var to = [email_address_arr[i]];   // result[0]['email']
          var from = 'Monitics<monitics@wedigtech.com>';
          var replyTo = 'Monitics<monitics@wedigtech.com>';
          
          var bgcolor = "green";
          if( service_type == 'stopped' ) {
              bgcolor = "#ff000";
          }
          ses.sendEmail({

             Source: from, 
             Destination: { ToAddresses: to },
             Message: {
              Subject: {
               Data: data.title+' is '+service_type
              },
              Body: {
               Html: {
                Data: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Analytics</title></head><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="'+bgcolor+'" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:20px; width:auto;"><span style=" font-family:Arial, Helvetica, sans-serif; font-size:24px; margin-top:0;  margin-left:10px; float:left; font-waight:600; padding:0 0 0; width:100%; text-align:left;">Monitics Services</span> </a></td></tr><tr><td style="padding:15px 30px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042; " colspan="2">Hello,</td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">We are sending this email to notify you that '+data.title+' '+message+'.</td></tr><tr><td width="70%"><div style="font-size:14px; color:#01b84e; display:block; margin:0px 0 5px; font-weight:bold;">Monitics Services</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;"><a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">http://app.monitics.co</a></p><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">For any further assistance please e-mail us at <a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">support@monitics.co</a></p></td><td width="30%"><div style="float:right;"></div></td></tr></table></td></tr></table></body></html>',
               }
              }
             }
            }, function(err, data) {
          });
        
        }
      }
  }


   function restart_service(data,app_id,callback){

        var details = data.details;
        var host = details.host; 
        var username = details.username;
        var password = details.password;  
        var title = data.title;
        var filePath =details.filePath;
        var fileName =details.fileName;
        var key =details.key;
        var url = details.URL;
        var exec = require('node-ssh-exec');
        var response = {}; 
        //stop service
        var config_stop = {
          username: username,
          host: host,   
          password: password
        },
        command_stop = 'cd '+url+' && echo '+password+' | sudo forever list';

        exec(config_stop, command_stop, function (error, responseAPI) {

            if (error) {

                response['authCode'] = apps_error_code;
                response['authMessage'] = error.level;
                response['params'] = error;
                callback(response);
            }else{
                
                var string = responseAPI;
                expr = fileName;
                if(string.match(expr)){

                  start_service();

                }else{
                   
                   response['authCode'] = apps_error_code;
                   response['authMessage'] = 'Connection established but service is not stopped';
                   response['params'] = 'Connection established but service is not stopped';
                   savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                   callback(response);
                }  
            } 
             
        }); 
        

        function start_service(){
          //start service
          var config_start = {
            username: username,
            host: host,   
            password: password
          },
          command_start = 'cd '+url+' && echo '+password+' | sudo forever list';
          exec(config_start, command_start, function (error, responseAPI) {

            if (error) {
                response['authCode'] = apps_error_code;
                response['authMessage'] = error.level;
                response['params'] = error;
                callback(response);
            }
            var string = responseAPI;
            expr = fileName;
            if(string.match(expr)){
               
               response['authCode'] = apps_success_code;
               response['authMessage'] = 'Connection established and service is active';
               response['params'] = 'Connection established and service is active';
               savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){}); 
              
            }else{
               
               response['authCode'] = apps_error_code;
               response['authMessage'] = 'Connection established but service is not active';
               response['params'] = 'Connection established but service is not active';
               savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
            }   
             callback(response);
          }); 
        }
  }
router.post('/connection_status/:type', function(req, res, next) {

  var response = {};
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());
  var data = JSON.parse(req.body.data);
  var connectionType = data.type;
  var details = data.details;
  var app_id = new ObjectID(data.app_id);

    /* for node services*/
    if(connectionType == 'SSH'){

            var host = details.host; 
            var username = details.username;
            var password = details.password;  
            var title = data.title;
            var filePath =details.filePath;
            var fileName =details.fileName;
            var key =details.key;
            var exec = require('node-ssh-exec'); 
            var config = {
              username: username,
              host: host,   
              password: password
              },
            command = 'echo '+password+' | sudo -S forever list';
            //command = 'cd /var/www/html/ && echo wedigtech@1234 | sudo -S ls';
            exec(config, command, function (error, responseAPI) {
            if (error) {
                
                response['authCode'] = apps_error_code;
                response['authMessage'] = error.level;
                response['params'] = error;
                res.json(response);
                return false;
              
              }else{
                  
                  var string = responseAPI;
                  expr = fileName;
                  if(string.match(expr)){
                     response['authCode'] = apps_success_code;
                     response['authMessage'] = 'Connection established and service is active';
                     response['params'] = string;//'Connection established and service is active';
                     savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){}); 
                  }else{
                     response['authCode'] = apps_error_code;
                     response['authMessage'] = 'Connection established but service is not active';
                     response['params'] = string;
                     savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                  }   
                  res.json(response);
            }
           }); 
    }
    /* for mongoDB services*/
    else if(connectionType == 'Mongo'){

        var database = details.database;
        var tablename = details.tablename;
        var portnumber = details.portnumber;   
        var parameter = details.parameter;
        var value1 =details.value ;
        var query = details.query;
        var hostname = details.hostname; 
        var username = details.username;
        var password = encodeURIComponent(details.password);  

        var mongo = require('mongodb');
        var MongoClient = mongo.MongoClient;    
        if(username != "" && password !=""){
            var connectionString = 'mongodb://'+username+':'+password+'@'+hostname+':'+portnumber+'/admin';
        }else{
            var connectionString = 'mongodb://'+hostname+':'+portnumber+'/'+database;      
        } 
          
           /* var connectionString =  'mongodb://'+hostname+':'+portnumber+'/'+database;*/
            //var connectionString =  "mongodb://35.162.57.54:27017/yappn_monitoring";   
        MongoClient.connect(connectionString, function (err, db) {    
         /*console.log(connectionString);*/
          if(err){ 
              response['authCode'] = apps_error_code;
              response['authMessage'] = err;
              response['params'] = err;
              res.json(response);
              return false;
          }else{ 
                var collection = db.collection(query);         
                collection.find().limit(1).toArray(function(err, results) { 

                  if(err){
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = err;
                    response['params'] = err;
                    savelogs(data,'Stopped',err,'Browser',data.monitor_id,app_id,function(data){});
                    res.json(response);
                    return false;
                  }else{             
                    response['authCode'] = apps_success_code;
                    response['authMessage'] = 'Connection established and service is active';
                    response['params'] =  JSON.stringify(results);
                    savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});      
                    res.json(response);
                  }
                  db.close();
               });            
          } 
                     
           });
      }  /* for mysql services*/
    else if(connectionType == 'Mysql'){
      
        var database = details.database;
        var tablename = details.tablename;
        var portnumber = details.portnumber;   
        var parameter = details.parameter;
        var value1 =details.value ;
        var query = details.query;
        var hostname = details.hostname; 
        var username = details.username;
        var password = details.password;  
        var success_parameter = details.success_parameter;  
        var success_response = details.success_response;  


        var mysql = require("mysql");
        // First you need to create a connection to the db
        var express    = require("express");
        var mysql      = require('mysql');    
        var connection = mysql.createConnection({
          host     : hostname,
          user     : username,
          password : password,
          database : database
        });
        var app = express();
        connection.connect(function(err){
          if(!err) {
            var queryString = query; 
            console.log(queryString);
            connection.query(queryString, function(err, rows, fields) {
                if (err){
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = "Error connecting database";
                    response['params'] = err;
                    savelogs(data,'Stopped',err,'Browser',data.monitor_id,app_id,function(data){});
                    res.json(response);
                    return false;  
                }else{
                    console.log(rows.length);
                    if(rows.length == success_response){
                    response['authCode'] = apps_success_code;
                    response['authMessage'] = 'Connection established and service is active';
                    response['params'] = rows;//"Connection established and service is active";
                    savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});    
                    res.json(response);
                  }else{
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = "Connection established and but responce doesn't matched";
                    response['params'] = rows;//"Connection established and service is active";
                    savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});    
                    res.json(response);

                  }
                }          
            });            
          } else {
                response['authCode'] = apps_error_code;
                response['authMessage'] = "Error connecting database";
                response['params'] = err;
                savelogs(data,'Stopped',err,'Browser',data.monitor_id,app_id,function(data){});
                res.json(response);
                return false;
            }
        });
    } 
    else if(connectionType == 'API'){
        /* for API services*/
        var selected_method = details.selected_method;
        var URL = details.URL;
        var SuccessParam = details.SuccessParam;   
        var SuccessResp = details.SuccessResp; 
            
        if(selected_method == 'GET'){
            var request = require('request');
            require('request-to-curl');       
            request(URL, function (error, responseData, body){
                var returndata = responseData.body;
                var returnMessage = responseData;
                var isValidJSON = returndata ? true : false
                try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                if(isValidJSON == true){
                    var responseData = JSON.parse(responseData.body); 
                    if(responseData[SuccessParam] == SuccessResp){               
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = 'Connection established and service is active';
                        response['params'] = returnMessage;
                        savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});    
                        res.json(response);
                    }else{
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = "Connection established but response didn't matched";
                        response['params'] = returnMessage;
                        savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                        res.json(response);
                    }
                }else{
                      response['authCode'] = apps_error_code;
                      response['authMessage'] = "Invalid response";
                      response['params'] = "Invalid response";
                      savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                      res.json(response);
                }
            })
        }else{

           
            if(details.request_type  == 'raw_body'){

                var obj = details.raw_body;
                //var obj = {"meta_data":{"group":"ramandeep"},"text":"3testing@wedigtech"};
                //var obj = JSON.stringify(obj);                
            }else{
                var postKeyValue = details.postKeyValue;
                var a = postKeyValue;
                var obj = {};
                for(var i=0; i < a.length; i++) {
                var key = a[i]["key"],
                    value = a[i]["value"];
                obj[key] = value;
                }
            }        

            var request = require('request');

            // Set the headers
            var headers = {
                'User-Agent':       'Super Agent/0.0.1',
                'Content-Type':     'application/x-www-form-urlencoded'
            }
           
            // Configure the request
            var options = {
                url: URL,
                method: 'POST',
                headers: headers,
                form: obj,
                encoding: null }               
            // Start the request
            request(options, function (error, responsedata, body) {  
                var zlib = require('zlib');   
                var request = require('request');
                var returnMessage = responsedata;

                if(lib.is_not_empty(responsedata)){              
                  
                  if(responsedata.headers['content-encoding'] && responsedata.headers['content-encoding'].toLowerCase().indexOf('gzip') > -1) {  

                      var body1 = responsedata.body;     

                      zlib.gunzip(responsedata.body, function(error, data2) {
                         
                          if(!error) {                            
                              var returndata = data2.toString(); 
                              
                              //console.log(returndata);
                              var isValidJSON = returndata ? true : false
                              try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                              if(isValidJSON == true){ 
                                var responsedata = JSON.parse(returndata);   
                                /*console.log(responsedata);               */                        
                                if(responsedata[SuccessParam] == SuccessResp){               
                                    response['authCode'] = apps_success_code;
                                    response['authMessage'] = 'Connection established and service is active';
                                    response['params'] = returnMessage;//"Connection established and service is active";
                                    savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});  
                                         
                                    res.json(response);
                                }else{
                                    response['authCode'] = apps_error_code;
                                    response['authMessage'] = "Connection established but response didn't matched";
                                    response['params'] = returnMessage;//"Error";  
                                     savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});            
                                    res.json(response);
                                }
                              }else{
                                    response['authCode'] = apps_error_code;
                                    response['authMessage'] = "Invalid responsew";
                                    response['params'] = "Invalid response"; 
                                     savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});            
                                    res.json(response);
                              }
                               
                          } else {
                                  /*console.log('returndata');*/
                                  response['authCode'] = apps_error_code;
                                  response['authMessage'] = "Invalid response";
                                  response['params'] = "Invalid response";  
                                  savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});       
                                  res.json(response);
                             
                          }
                      });
                  }else{
                      /*console.log('unzip');*/
                      var returndata = responsedata.body;
                      
                      var isValidJSON = returndata ? true : false
                      try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                      if(isValidJSON == true){ 
                          var responsedata = JSON.parse(responsedata.body);                   
                          if(responsedata[SuccessParam] == SuccessResp){               
                              response['authCode'] = apps_success_code;
                              response['authMessage'] = 'Connection established and service is active';
                              response['params'] = returnMessage;//"Connection established and service is active";
                              savelogs(data,'Success',response['params'],'Browser',data.monitor_id,app_id,function(data){});    
                              res.json(response);
                            }else{
                              response['authCode'] = apps_error_code;
                              response['authMessage'] = "Connection established but response didn't matched";
                              response['params'] = returnMessage;//"Error";
                              savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                              res.json(response);
                            }
                      }else{
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = "Invalid response";
                            response['params'] = "Invalid response";
                            savelogs(data,'Stopped',response['params'],'Browser',data.monitor_id,app_id,function(data){});
                            res.json(response);
                      }
                  }
                
                }else{

                  response['authCode'] = apps_error_code;
                  response['authMessage'] = "Invalid response";
                  response['params'] = "Invalid response";
                  res.json(response);
                }               
            })
        }
    }else{

    response['authCode'] = apps_error_code;
    response['authMessage'] = "Invalid type";
    response['params'] =  "Invalid type";
    res.json(response);
    return false;
    }
});
savelogs = function(data,message,responseresult,source,monitorID,app_id,callback){

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());
    var monitoring_data_arr = {};
    monitoring_data_arr['task'] = data.title+' Check';
    monitoring_data_arr['status'] = message;
    monitoring_data_arr['created'] = current_date;
    monitoring_data_arr['app_id'] =  app_id;
    monitoring_data_arr['user_id'] = new ObjectID(data.user_id);
    monitoring_data_arr['monitoring_id'] = new ObjectID(monitorID);
    monitoring_data_arr['action'] = 'monitoring';
    monitoring_data_arr['source'] = source;
    monitoring_data_arr['response'] = responseresult;
    /*   console.log(monitoring_data_arr);*/
    var save_events_data_connection = connection.monitoring_logs(monitoring_data_arr);
    save_events_data_connection.save( function( err, result ) {
       /*console.log(data.title +'---'+data.action +'--'+ message +'--'+source  );*/
      if(data.action == 'Email' && message == 'Stopped' && source=="scheduleJob"){
        
        var email_address_str = data.email_address;
        var email_address_arr = email_address_str.split(",");
      console.log(email_address_arr);
        if( lib.is_not_empty(email_address_arr) ) {
      
            for( var i=0; i<email_address_arr.length; i++ ) {

                var ses = new aws.SES({apiVersion: '2010-12-01'});
                var to = [email_address_arr[i]];   // result[0]['email']
                var from = 'Monitics<monitics@wedigtech.com>';
                var replyTo = 'Monitics<monitics@wedigtech.com>';

                ses.sendEmail({

                   Source: from, 
                   Destination: { ToAddresses: to },
                   Message: {
                    Subject: {
                     Data: data.title+' is stopped'
                    },
                    Body: {
                     Html: {
                      Data: '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Analytics</title></head><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="#ff000" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:20px; width:auto;"><span style=" font-family:Arial, Helvetica, sans-serif; font-size:24px; margin-top:0;  margin-left:10px; float:left; font-waight:600; padding:0 0 0; width:100%; text-align:left;">Monitics Services</span> </a></td></tr><tr><td style="padding:15px 30px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042; " colspan="2">Hello,</td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">We are sending this email to notify you that '+data.title+' is stopped.</td></tr><tr><td width="70%"><div style="font-size:14px; color:#01b84e; display:block; margin:0px 0 5px; font-weight:bold;">Monitics Services</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;"><a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">http://app.monitics.co</a></p><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">For any further assistance please e-mail us at <a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">support@monitics.co</a></p></td><td width="30%"><div style="float:right;"></div></td></tr></table></td></tr></table></body></html>',
                     }
                    }
                   }
                  }, function(err, data) {
                });
            }
        }
      

            
            /*var sendmail = require('sendmail');    
            var htmlContent = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>Analytics</title></head><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="#ff000" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:20px; width:auto;"><span style=" font-family:Arial, Helvetica, sans-serif; font-size:24px; margin-top:0;  margin-left:10px; float:left; font-waight:600; padding:0 0 0; width:100%; text-align:left;">Analytics Monitoring Services</span> </a></td></tr><tr><td style="padding:15px 30px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042; " colspan="2">Hello,</td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">We are sending this email to notify you that '+data.title+' service is stopped.</td></tr><tr><td width="70%"><div style="font-size:14px; color:#01b84e; display:block; margin:0px 0 5px; font-weight:bold;">Analytics Monitoring Services</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;"><a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">http://analyticsapp.com</a></p><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">For any further assistance please e-mail us at <a href="javascript:void(0);" style="text-decoration:none; font-size:12px; color:#414042; font-weight:normal;">support@analyticsapp.com</a></p></td><td width="30%"><div style="float:right;"></div></td></tr></table></td></tr></table></body></html>'; 
              sendmail({
                  from: 'user1.guts@gmail.com',
                  to: data.email_address,
                  subject: data.title+' service is stopped',
                  html: htmlContent,
                }, function(err, reply) {
                               
              });*/
        }
        callback(result);
    });  
}

router.get('/monitors/logs/:monitoring_id', function(req, res, next) {

    var app_id = new ObjectID(req.headers.app_id);
    var sort_by = req.headers.sort_by;
    var monitoring_id = new ObjectID(req.params.monitoring_id);
    var no_of_days = req.headers.no_of_days;
    var item_per_page = req.headers.item_per_page;
    var order_by = parseInt(req.headers.order_by);

    time_zone_query(app_id,function( time_zone ) {
        
        var current_date_new = new Date();
        var current_date_new = new Date(current_date_new.getTime());

        var current_date = lib._time_zone_data( time_zone,current_date_new );
        current_date = new Date(current_date);
        
        if(req.headers.offset!=0)
        {
         var offset = (req.headers.offset-1)*item_per_page; 
        }else{
         var offset = 0;
        }
         var response = {};
        var skip=parseInt(item_per_page)+parseInt(offset);
        var time_before_days = new Date(current_date.getTime() + (-no_of_days*24*60*60*1000));
        var current_date_new_s = new Date(current_date.getTime() + (+7*60*1000));

        if(lib.is_not_empty(sort_by) && lib.is_not_empty(order_by))
        {
         // time_zone_query(app_id,function( time_zone ) {
          
             
              var monitor_key = 0;
              var monitor_arr = [];
              var monitor_data_query = [
                          {
                            $project:
                            {
                              //find value for created date
                              '_id':1,'action':1,'user':1,'status':1,'app_id':1,'user_id':1,'created':1,'insensitive':1,'log':1,'source':1,'response':1,'monitoring_id':1,'task':1,
                              insensitive: { "$toUpper": "$"+sort_by}
                            }
                          },      
                          {
                            $match:{
                              $and:[{'monitoring_id':monitoring_id},{'created':{ $gte: time_before_days, $lt:current_date_new_s }}],
                            }   
                          },
                          { "$sort": { "insensitive": order_by} },
                          { $limit : skip},
                          {$skip:offset}
                      ];
              var monitor_data_query_count = {'monitoring_id':monitoring_id,'created':{ $gte: time_before_days, $lt:current_date_new_s }};
              connection.monitoring_logs.count(monitor_data_query_count,function(err,monitor_data_count){
                monitor_data_count_function(monitor_data_count);
              })
              function monitor_data_count_function(monitor_data_count)
              {
                connection.monitoring_logs.aggregate(monitor_data_query,function(err,monitor_data_exist){

                    function monitor_data(monitor_key)
                    {
                      if(lib.is_not_empty(monitor_data_exist) && monitor_key<monitor_data_exist.length){

                          /*var created = "";
                          if(lib.is_not_empty(monitor_data_exist[monitor_key]['created'])){
                            
                            created = date_format(monitor_data_exist[monitor_key]['created'], "mm/dd/yyyy HH:MM");
                          }*/

                            monitor_arr[monitor_key] = {

                              "monitor_log_id":monitor_data_exist[monitor_key]['_id'],
                              "task":monitor_data_exist[monitor_key]['task'],
                              "status":monitor_data_exist[monitor_key]['status'],
                              "action":monitor_data_exist[monitor_key]['action'],
                              "app_id":monitor_data_exist[monitor_key]['app_id'],
                              "user_id":monitor_data_exist[monitor_key]['user_id'],
                              "user":monitor_data_exist[monitor_key]['user'],
                              "log":monitor_data_exist[monitor_key]['log'],
                              "source":monitor_data_exist[monitor_key]['source'],
                              "response":monitor_data_exist[monitor_key]['response'],
                              "created":lib._time_zone_data( time_zone,monitor_data_exist[monitor_key]['created']),
                            };
                            //console.log(monitor_arr);
                            //evnt_data_found(monitor_arr);
                            event_data_query();
                      } else {
                          //res.send(monitor_arr);
                          if(monitor_arr.length>0)
                          {
                            response['authCode'] = apps_success_code;
                            response['monitor_data_count']=monitor_data_count;
                            response['authMessage'] = fetch_data;
                            response['params'] = monitor_arr;
                            res.json(response);
                          }else{
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = monitor_not_found;
                            response['params'] = monitor_not_found;
                            res.json(response);
                          }
                      }
                    }
                    function event_data_query()
                    {
                      monitor_key++;
                      monitor_data(monitor_key);
                    }
                     monitor_data(monitor_key);
                })/*.sort({ created : -1 }).skip(offset).limit(item_per_page);*/
              }
         // });

        } else {
                 response['authCode'] = apps_error_code;
                 response['authMessage'] = empty_sort_order_by;
                 response['params'] = empty_sort_order_by;
                 res.json(response);
        }

    });
});

router.get('/scheduleJob/:type', function(req, res, next) {
   
  var response = {};
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());
  var monitor_key = 0;
  connection.apps.find({'status':'active'},function(err,data){
    if(data.length > 0){       
        var key = 0;
        function fun_app(key){
            if( key < data.length){
                var app_id = new ObjectID(data[key]._id);
                connection.monitoring.find({'status':'active','service_status':1,app_id:app_id},function(err1,data1){

                    v_key = 0;
                    function fun_find_conn(v_key) {
                        if(v_key < data1.length){ 
                            /*   console.log('-----------'+ app_id);        */                                           
                            ScheduledConnectionCheck(data1[v_key],app_id);                          
                            v_key++;
                            fun_find_conn(v_key);
                        } else {
                            key++;
                            fun_app(key);
                        }
                    }
                    fun_find_conn(v_key);
                });
            } else {
                response['authCode'] = apps_success_code;
                response['authMessage'] = 'Success';
                response['params'] = 'Success';
                res.json(response);
            }
        }
        fun_app(key);
    }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = apps_data_not_found;
        response['params'] = apps_data_not_found;
        res.json(response);
    }
  }).sort( { app_name: 1 } );   
});

ScheduledConnectionCheck = function(data3,app_id){
 
    var response = {};
    var data = data3;   
    var connectionType = data.type;
    var details = data.details[0];
    
    /* for node services*/
    if(connectionType == 'SSH'){

            var host = details.host; 
            var username = details.username;
            var password = details.password;  
            var title = data.title;
            var filePath =details.filePath;
            var fileName =details.fileName;
            var key =details.key;
            var url = filePath;
            var port_type = details.port_type;
            var portnumber = details.port_type;
            var minPortNo = details.minPortNo;
            var maxPortNo =  details.maxPortNo;
            var multiple_port_no =details.multiple_port_no;
            var service_type = 'start';
            var exec = require('node-ssh-exec'); 
            var config = {
              username: username,
              host: host,   
              password: password
              },
            command = 'echo '+password+' | sudo -S forever list';
            //command = 'cd /var/www/html/ && echo wedigtech@1234 | sudo -S ls';
            exec(config, command, function (error, responseAPI) {
            if (error) {
                response['authCode'] = apps_error_code;
                response['authMessage'] = error.level;
                response['params'] = error;
                /*res.json(response);*/
                return false;
              }
            var string = responseAPI;
            expr = fileName;
            if(string.match(expr)){
               response['authCode'] = apps_success_code;
               response['authMessage'] = 'Connection established and service is active';
               response['params'] = 'Connection established and service is active';
               savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){}); 
            }else{
                
               response['authCode'] = apps_error_code;
               response['authMessage'] = 'Connection established but service is not active';
               response['params'] = 'Connection established but service is not active';
               savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});

               if(port_type == 'range'){

                        var config_start = {
                          username: username,
                          host: host,   
                          password: password
                        },
                        command_stop = 'cd '+url+' && echo '+password+' | sudo -S forever stop '+fileName; 
                        exec(config_start, command_stop, function (error, responseAPI) {
                          if (error) {
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = error.level;
                            response['params'] = error;
                            res.json(response);
                          }else{

                            var key = minPortNo;
                            function run_commands( key ) {

                              if( key <= maxPortNo ) {
                                
                                command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+key;  
                                //console.log(command_start);                       
                                exec(config_start, command_start, function (error, responseAPI) {
                                  
                                  key++;
                                  run_commands( key );             
                                });
                              } else {
                                
                                response['authCode'] = apps_success_code;
                                response['authMessage'] = 'Connection Started by Admin manually';
                                response['params'] =  'Connection Started by Admin manually';
                                var service_type = 'start';
                                var message;
                                if( service_type=='start' ) {

                                  message = 'is started';
                                  send_stop_start_email(data , message, 'started' );
                                    
                                }
                                
                              }
                            }
                            run_commands( key );            
                          }
                        });
                }else if(port_type == 'single'){

                    var config_start = {
                      username: username,
                      host: host,   
                      password: password
                    },
                    command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+portnumber;  
                    exec(config_start, command_start, function (error, responseAPI) { 
                      
                      if (error) {
                        
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = error.level;
                        response['params'] = error;
                        res.json(response);
                      }else{
                        
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = 'Connection Started by Admin manually';
                        response['params'] =  'Connection Started by Admin manually';
                        

                         var message;
                          if( service_type=='start' ) {

                            message = 'is started';
                            send_stop_start_email(data , message, 'started' );
                              
                          }
                      }              
                    });
                }else if(port_type == 'multiple'){

                    var config_start = {
                      username: username,
                      host: host,   
                      password: password
                    },
                    command_stop = 'cd '+url+' && echo '+password+' | sudo -S forever stop '+fileName; 
                    exec(config_start, command_stop, function (error, responseAPI) {
                      if (error) {
                        
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = error.level;
                        response['params'] = error;
                        res.json(response);
                      }else{                  

                        var key = 0;
                        function run_commands( key ) {

                          if( key < multiple_port_no.length ) {
                            
                            command_start = 'cd '+url+' && echo '+password+' | sudo -S forever start '+fileName+' '+multiple_port_no[key]['port_no']; 
                            //console.log(command_start);                       
                            exec(config_start, command_start, function (error, responseAPI) {
                              
                              key++;
                              run_commands( key );             
                            });
                          } else {
                            
                            response['authCode'] = apps_success_code;             
                            response['authMessage'] = 'Connection Started by Admin manually';
                            response['params'] =  'Connection Started by Admin manually';

                             var message;
                                    if( service_type=='start' ) {

                                      message = 'is started by admin manually';
                                      send_stop_start_email(data , message, 'started' );
                                        
                                    }else if(service_type=='restart'){

                                        message = 'is restarted by admin manually';
                                        send_stop_start_email(data , message, 'restarted' );
                                        
                                    }
                            
                            
                          }
                        }
                        run_commands( key );
                      }
                    });
                } 



            }   
           
            /*res.json(response);*/
           }); 
    }
    /* for mongoDB services*/
    else if(connectionType == 'Mongo'){

        var database = details.database;
        var tablename = details.tablename;
        var portnumber = details.portnumber;   
        var parameter = details.parameter;
        var value1 =details.value ;
        var query = details.query;
        var hostname = details.hostname; 
        var username = details.username;
        var password = encodeURIComponent(details.password);  

        var mongo = require('mongodb');
        var MongoClient = mongo.MongoClient;    
        if(username != "" && password !=""){
            var connectionString = 'mongodb://'+username+':'+password+'@'+hostname+':'+portnumber+'/admin';
        }else{
            var connectionString = 'mongodb://'+hostname+':'+portnumber+'/'+database;      
        } 
          
           /* var connectionString =  'mongodb://'+hostname+':'+portnumber+'/'+database;*/
            //var connectionString =  "mongodb://35.162.57.54:27017/yappn_monitoring";   
        MongoClient.connect(connectionString, function (err, db) {    
         //console.log(connectionString);
          if(err){ 
              response['authCode'] = apps_error_code;
              response['authMessage'] = err;
              response['params'] = err;
              /*res.json(response);*/
              return false;
          }else{ 
                var collection = db.collection(query);         
                collection.find().limit(1).toArray(function(err, results) { 

                  if(err){
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = err;
                    response['params'] = err;
                    savelogs(data,'Stopped',err,'scheduleJob',data._id,app_id,function(data){});
                    /*res.json(response);*/
                    return false;
                  }else{             
                    response['authCode'] = apps_success_code;
                    response['authMessage'] = 'Connection established and service is active';
                    response['params'] =  JSON.stringify(results);
                    savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){});      
                    /*res.json(response);*/
                  }
                  db.close();
               });            
          } 
                     
           });
      }  /* for mysql services*/
    else if(connectionType == 'Mysql'){

        var database = details.database;
        var tablename = details.tablename;
        var portnumber = details.portnumber;   
        var parameter = details.parameter;
        var value1 =details.value ;
        var query = details.query;
        var hostname = details.hostname; 
        var username = details.username;
        var password = details.password;  
        
        var mysql = require("mysql");
        // First you need to create a connection to the db
        var express    = require("express");
        var mysql      = require('mysql');    
        var connection = mysql.createConnection({
          host     : hostname,
          user     : username,
          password : password,
          database : database
        });
        var app = express();
        connection.connect(function(err){
          if(!err) {
            var queryString = query; 
            connection.query(queryString, function(err, rows, fields) {
                if (err){
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = "Error connecting database";
                    response['params'] = err;
                    savelogs(data,'Stopped',err,'scheduleJob',data._id,app_id,function(data){});
                    /*res.json(response);*/
                    return false;  
                }else{
                    response['authCode'] = apps_success_code;
                    response['authMessage'] = 'Connection established and service is active';
                    response['params'] = "Connection established and service is active";
                    savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){});    
                   /* res.json(response);*/
                }          
            });            
          } else {
                response['authCode'] = apps_error_code;
                response['authMessage'] = "Error connecting database";
                response['params'] = err;
                savelogs(data,'Stopped',err,'scheduleJob',data._id,app_id,function(data){});
               /* res.json(response);*/
                return false;
            }
        });
    }else if(connectionType == 'API'){

        /* for API services*/
        var selected_method = details.selected_method;
        var URL = details.URL;
        var SuccessParam = details.SuccessParam;   
        var SuccessResp = details.SuccessResp; 
            
        if(selected_method == 'GET'){
            var request = require('request');
            require('request-to-curl');       
            request(URL, function (error, responseData, body){
                var returndata = responseData.body;
                var isValidJSON = returndata ? true : false
                try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                if(isValidJSON == true){
                    var responseData = JSON.parse(responseData.body); 
                    if(responseData[SuccessParam] == SuccessResp){               
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = 'Connection established and service is active';
                        response['params'] = "Connection established and service is active";
                        savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){});    
                        /*res.json(response);*/
                    }else{

                        response['authCode'] = apps_error_code;
                        response['authMessage'] = "Error";
                        response['params'] = "Error";
                        savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});
                        /*res.json(response);*/
                    }
                }else{
                     response['authCode'] = apps_error_code;
                      response['authMessage'] = "Invalid response";
                      response['params'] = "Invalid response";
                      savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});
                      /*res.json(response);*/
                }
            })
        }else{

           
            if(details.request_type  == 'raw_body'){

                var obj = details.raw_body;
                //var obj = {"meta_data":{"group":"ramandeep"},"text":"3testing@wedigtech"};
                //var obj = JSON.stringify(obj);                
            }else{
                var postKeyValue = details.postKeyValue;
                var a = postKeyValue;
                var obj = {};
                for(var i=0; i < a.length; i++) {
                var key = a[i]["key"],
                    value = a[i]["value"];
                obj[key] = value;
                }
            }        

            var request = require('request');

            // Set the headers
            var headers = {
                'User-Agent':       'Super Agent/0.0.1',
                'Content-Type':     'application/x-www-form-urlencoded'
            }
           
            // Configure the request
            var options = {
                url: URL,
                method: 'POST',
                headers: headers,
                form: obj,
                encoding: null }               
            // Start the request
            request(options, function (error, responsedata, body) {  
                var zlib = require('zlib');   
                var request = require('request');
                               
                if(responsedata.headers['content-encoding'] && responsedata.headers['content-encoding'].toLowerCase().indexOf('gzip') > -1) {  

                    var body1 = responsedata.body;     

                    zlib.gunzip(responsedata.body, function(error, data2) {
                       
                        if(!error) {                            
                            var returndata = data2.toString(); 
                            //console.log(returndata);
                            var isValidJSON = returndata ? true : false
                            try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                            if(isValidJSON == true){ 
                              var responsedata = JSON.parse(returndata);   
                              /*console.log(responsedata);               */                        
                              if(responsedata[SuccessParam] == SuccessResp){               
                                  response['authCode'] = apps_success_code;
                                  response['authMessage'] = 'Connection established and service is active';
                                  response['params'] = "Connection established and service is active";
                                  savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){});  
                                       
                                  /*res.json(response);*/
                              }else{
                                  response['authCode'] = apps_error_code;
                                  response['authMessage'] = "Error";
                                  response['params'] = "Error";  
                                   savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});            
                                  /*res.json(response);*/
                              }
                            }else{
                                  response['authCode'] = apps_error_code;
                                  response['authMessage'] = "Invalid responsew";
                                  response['params'] = "Invalid response"; 
                                   savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});            
                                  /*res.json(response);*/
                            }
                             
                        } else {
                                /*console.log('returndata');*/
                                response['authCode'] = apps_error_code;
                                response['authMessage'] = "Invalid response";
                                response['params'] = "Invalid response";  
                                savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});       
                                /*res.json(response);*/
                           
                        }
                    });
                }else{
                    /*console.log('unzip');*/
                    var returndata = responsedata.body;
                    var isValidJSON = returndata ? true : false
                    try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                    if(isValidJSON == true){ 
                        var responsedata = JSON.parse(responsedata.body);                   
                        if(responsedata[SuccessParam] == SuccessResp){               
                            response['authCode'] = apps_success_code;
                            response['authMessage'] = 'Connection established and service is active';
                            response['params'] = "Connection established and service is active";
                            savelogs(data,'Success',response['params'],'scheduleJob',data._id,app_id,function(data){});    
                            /*res.json(response);*/
                          }else{
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = "Error";
                            response['params'] = "Error";
                            savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});
                            /*res.json(response);*/
                          }
                    }else{
                          response['authCode'] = apps_error_code;
                          response['authMessage'] = "Invalid response";
                          response['params'] = "Invalid response";
                          savelogs(data,'Stopped',response['params'],'scheduleJob',data._id,app_id,function(data){});
                          /*res.json(response);*/
                    }
                }               
            })
        }
    } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = "Invalid type";
        response['params'] =  "Invalid type";
        /* res.json(response);*/
        return false;
    }
}

router.get('/testpost/:type', function(req, res, next) {
     var response = {}
    var zlib = require('zlib');   
    var request = require('request');
    var requestData = {"token":"b35dd29eabd71baaa5c82d34b8b0d77c","target_lang":"zh-CN","include_keys":"","exclude_keys":"","meta_data":{"group":"ramandeep"},"text_json":{"tst":"3amasarjeet"}};
     var requestD = JSON.stringify(requestData);
    /* res.send(requestD);
     return false;*/
    // Set the headers
    var headers = {

        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/rawBody'
    }
    var URL = 'http://ymd4.yappn.com/rbapi/ngtsta';
    // Configure the request
    var options = {
        url: URL,
        json:true,
        method: 'POST',
        headers: headers,
        form: requestD,
        encoding: null

    }
    
    /*form: obj*/
    // Start the request
    request(options, function (error, responsedata, body) { 

         
           if(responsedata.headers['content-encoding'] && responsedata.headers['content-encoding'].toLowerCase().indexOf('gzip') > -1) {   
                var body = responsedata.body;                    
                zlib.gunzip(responsedata.body, function(error, data) {
                    if(!error) {
                        
                        var returndata = data.toString();
                        var isValidJSON = returndata ? true : false
                    try { JSON.parse(returndata) } catch(e) { isValidJSON = false }
                    if(isValidJSON == true){ 
                      var responsedata = JSON.parse(returndata);  
                      console.log(responsedata);
                      return false ;           
                      if(responsedata[SuccessParam] == SuccessResp){               
                          response['authCode'] = apps_success_code;
                          response['authMessage'] = 'Connection established and service is active';
                          response['params'] = "Connection established and service is active";
                               
                          res.json(response);
                      }else{
                          response['authCode'] = apps_error_code;
                          response['authMessage'] = "Error";
                          response['params'] = "Error";              
                          res.json(response);
                      }
                    }else{
                          response['authCode'] = apps_error_code;
                          response['authMessage'] = "Invalid response";
                          response['params'] = "Invalid response";             
                          res.json(response);
                    }
                         
                    } else {
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = "Invalid response";
                        response['params'] = "Invalid response";             
                        res.json(response);
                    }
                });
            }
            
    })

});


router.post('/testPostConnection/:type', function(req, res, next) {

  /*  var response = {};*/
    //data = JSON.parse(req.body);
    console.log("Request data:");
    res.send(req.body);


})


module.exports = router;