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
  var current_date = new Date(current_date_new.getTime());
  //var bodyParser = require( 'body-parser' );
  //router.use(bodyParser.json());
  //var multer          =       require('multer');
  //router.use(bodyParser.urlencoded({"extended" : true}));

  /* GET content of marters */

  router.post('/add', function(req, res, next) {

      var current_date_new = new Date();
      var current_date = new Date(current_date_new.getTime());
      var username = req.headers.username;
      var first_name = req.headers.first_name;
      var last_name = req.headers.last_name;
      var email_address = req.headers.email_address;
      var password = req.headers.password;
      var app_id = req.headers.app_id;
      var response = {};
      var user_data_arr = {};

      if(lib.is_not_empty(username) && lib.is_not_empty(first_name) && lib.is_not_empty(last_name) && lib.is_not_empty(email_address) && lib.is_not_empty(password) && lib.is_not_empty(app_id))
      {
          user_data_arr['username'] = username;
          user_data_arr['first_name'] = first_name;
          user_data_arr['last_name'] = last_name;
          user_data_arr['email_address'] = email_address;
          user_data_arr['password'] = md5(password);
          user_data_arr['status'] = 'active';
          user_data_arr['created'] = current_date;
          user_data_arr['modified'] = current_date;

          save_user_data(user_data_arr);

      } else {

        empty_data_validation()
      }

       function save_user_data(user_data_arr)
       {

          var save_users_data_connection = connection.users(user_data_arr);
          save_users_data_connection.save( function( err, result ) {

              response['authCode'] = apps_success_code;
              response['authMessage'] = user_data_save;
              response['params'] = user_data_save;
              res.json(response);
          });
       }

      function empty_data_validation()
      {
        if(!lib.is_not_empty(username))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_username;
          response['params'] = empty_username;
          res.json(response);
        }
        if(!lib.is_not_empty(first_name))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_first_name;
          response['params'] = empty_first_name;
          res.json(response);
        }
        if(!lib.is_not_empty(last_name))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_last_name;
          response['params'] = empty_last_name;
          res.json(response);
        }
        if(!lib.is_not_empty(email_address))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_email_address;
          response['params'] = empty_email_address;
          res.json(response);
        }
        if(!lib.is_not_empty(app_id))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_app_id;
          response['params'] = empty_app_id;
          res.json(response);
        }
      }

  });


/*  router.get('/:app_id', function(req, res, next) {

        var app_id = new ObjectID(req.params.app_id);
        var item_per_page = req.headers.item_per_page;
        var offset = (req.headers.offset-1)*item_per_page;
        var response = {};
        connection.app_event_users.count({'app_id':app_id,'status':'active'},function(err,count){
          app_event_users_data(count);
        });
        function app_event_users_data(count)
        {

            connection.app_event_users.find({'app_id':app_id,'status':'active'},function(err,data){
              var last_event_arr = [];
              var event_key = 0;
              function app_event_user_data_fun(event_key)
              {
                if(event_key<data.length)
                {
                  connection.user_events.find({'app_event_user_id':new ObjectID(data[event_key]['_id']),'status':'active','recent_status':1},function(err,user_event_data){

                      if(user_event_data.length>0)
                      {
                          connection.events.find({'_id':new ObjectID(user_event_data[0]['event_id']),'status':'active'},function(err,event_data){
                              if(event_data.length>0)
                              {
                                  event_name_function(event_data[0]['event_name']);
                              }else{
                                 event_name_function("-");
                              }
                              
                          });
                      }else{
                            event_name_function("-");
                      }                  

                  }).sort({created : -1 }).limit(1);
                  function event_name_function(event_name)
                  {
                    var active_time = data[event_key]['modified'];
                    active_time = active_time.toISOString();
                    active_time = active_time.split('.')[0].replace('T', ' ');
                    active_time = date_format(active_time,"dd mmmm,yy HH:MM");
                    var created_date_on = data[event_key]['created'];
                    created_date_on = created_date_on.toISOString();
                    created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                    var created_on = date_format(created_date_on, "dd mmmm,yy HH:MM");
                    last_event_arr[event_key] = {
                      'user_id':data[event_key]['_id'],
                      'username':data[event_key]['username'],
                      'first_name':data[event_key]['first_name'],
                      'last_name':data[event_key]['last_name'],
                      'email_address':data[event_key]['email_address'],
                      'created_on':created_on,
                      'active_time':active_time,
                      'event_name':event_name
                    };
                    event_key++;
                    app_event_user_data_fun(event_key);
                  }

                }else{
                    if(last_event_arr.length>0)
                    {
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = fetch_data;
                        response['params'] = last_event_arr;
                        response['total_count'] = count;
                        //response['item_per_page'] = item_per_page;
                        res.json(response);
                    }else{
                        response['authCode'] = apps_error_code;
                        response['authMessage'] = user_data_not_found;
                        response['params'] = user_data_not_found;
                        res.json(response);
                    }
                }

              }

              app_event_user_data_fun(event_key);
            }).skip(offset).limit(item_per_page);

        }
   
    });*/

  //search filter data
  router.get('/search/:app_id', function(req, res, next) {

        
        var app_id = new ObjectID(req.params.app_id);
        var item_per_page = parseInt(req.headers.item_per_page);
        var offset = (req.headers.offset-1)*item_per_page;
        var sort_by = req.headers.sort_by;
        var order_by = parseInt(req.headers.order_by);
        var search_string = req.headers.search_string;
        var skip=parseInt(item_per_page)+parseInt(offset);
         var response = {};
        if(lib.is_not_empty(sort_by) && lib.is_not_empty(order_by))
        {
            time_zone_query(app_id,function( time_zone ) {

              //var monthYearDay = lib.getMonthDateYear(search_string);
             // var type = req.headers.type;
             

               /* var user_data_query1 = {$and: [{ "app_id" : app_id},{ "status" : 'active'},{$or:[{'username':{'$regex':search_string,$options: '-i'}},{$where : 'return this.created.getMonth() == parseInt("'+monthYearDay['month']+'")'},{$where : 'return this.created.getYear() == parseInt("'+monthYearDay['year']+'")'},{$where : 'return this.created.getDate() == parseInt('+monthYearDay['day']+')'},{'email_address':{'$regex':search_string,$options: '-i'}},{'last_name':{'$regex':search_string,$options: '-i'}},{'first_name':{'$regex':search_string,$options: '-i'}}]}]};*/
              var user_data_query1 =   
              [
                {
                  $project:
                  {
                    //find value for created date
                    day_created: { $substr: [ "$created", 8, 2 ] },
                    second_created:{$second:"$created"},
                    year_created:{$year:"$created"},
                    month_created:{$month:"$created"},
                    hour_created:{$hour:"$created"},
                    minute_created:{$minute:"$created"},
                    //find value for modified
                    day_modified: { $substr: [ "$created", 8, 2 ] },
                    second_modified:{$second:"$modified"},
                    year_modified:{$year:"$modified"},
                    month_modified:{$month:"$modified"},
                    hour_modified:{$hour:"$modified"},
                    minute_modified:{$minute:"$modified"},
                    'username':1,'first_name':1,'last_name':1,'email_address':1,'status':1,'app_id':1,'created':1,'modified':1,'status':1,
                    insensitive: { "$toUpper": "$"+sort_by}
                  }
                }, 
                  {
                    $match:{
                      $and:[{app_id:app_id},{'status':'active'}],
                      $or:[
                           // {minutes:{"$minute":[search_string]}},
                           //find data by created date

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
                            {'first_name':{'$regex':search_string,$options: '-i'}}
                          ]
                  }   
                },

              ];
            
            // find arr for user_id
            var event_data_query2 = {$and: [{ "app_id" : app_id},{ "status" : 'active'},{'event_name':{'$regex':search_string,$options: '-i'}}]};

            var user_id_arr = [];
            var event_id_arr = [];
            var user_event_common_ar = [];
            connection.app_event_users.aggregate(user_data_query1,function(err,user_id_data){
               connection.events.find(event_data_query2,function(err,event_id_data){//res.send(event_id_data);
             
                    for(var i=0;i<user_id_data.length;i++)
                    {
                        user_id_arr[i] = user_id_data[i]['_id'];
                    }

                   for(var j=0;j<event_id_data.length;j++)
                   {
                      event_id_arr[j] = event_id_data[j]['_id'];
                   }


                    var event_user_common_data = {$and: [{ "recent_status" :1,"status":"active"},{$or:[{'app_event_user_id':{'$in':user_id_arr}},{'event_id':{'$in':event_id_arr}}]}]};
                  connection.user_events.find(event_user_common_data,function(err,result_common_data){//res.send(result_common_data);
                    for(var k = 0;k<result_common_data.length;k++)
                    {
                      user_event_common_ar[k] = result_common_data[k]['app_event_user_id'];
                    }
                    user_data_common_array_find(user_event_common_ar,user_id_arr,event_id_arr);
                  });
                });
            
            });
            
            function user_data_common_array_find(user_event_common_ar,user_id_arr,event_id_arr)
            {
              //res.send(user_event_common_ar);
                var user_data_query = [
                            {
                              $project:
                              {
                                //find value for created date
                                'username':1,'first_name':1,'last_name':1,'email_address':1,'status':1,'app_id':1,'created':1,'status':1,'modified':1,'insensitive':1,
                                insensitive: { "$toUpper": "$"+sort_by}
                              }
                            },
                              
                            {
                              $match:{
                                $and:[{'status':'active'}],
                                $or:[{'_id':{'$in':user_event_common_ar}},{'_id':{'$in':user_id_arr}}]
                            }   
                          },
                          { "$sort": { "insensitive": order_by} },
                          { $limit : skip},
                          {$skip:offset}

                        ];
              user_data_query_count = {$or:[{'_id':{'$in':user_event_common_ar}},{'_id':{'$in':user_id_arr}}]};
              //user_data_query = {"_id":{'$in':user_event_common_ar,user_id_arr}};
               // final user_id data
              connection.app_event_users.count(user_data_query_count,function(err,count){
                app_event_users_data(count,event_id_arr)
              });

              function app_event_users_data(count,event_id_arr)
              {
                  connection.app_event_users.aggregate(user_data_query,function(err,data){//res.send(data);
                    var last_event_arr = [];
                    var event_key = 0;
                    function app_event_user_data_function(event_key)
                    {
                      if(event_key<data.length)
                      {
                        connection.user_events.find({'app_event_user_id':new ObjectID(data[event_key]['_id']),'status':'active','recent_status':1},function(err,user_event_data){

                            if(user_event_data.length>0)
                            {

                                var event_query = {'_id':new ObjectID(user_event_data[0]['event_id']),'status':'active','app_id':app_id};

                                connection.events.find(event_query,function(err,event_data){

                                    if(event_data.length>0)
                                    {
                                      event_name_function(event_data[0]['event_name']);
                                    }else{
                                       event_name_function("-");
                                    }
                                });
                            }else{
                                  event_name_function("-");
                            }                  
                           // recent_event_data();
                        }).sort({ created : -1 }).limit(1);

                        function event_name_function(event_name)
                        {
                          /*var active_time = data[event_key]['modified'];
                          active_time = active_time.toISOString();
                          active_time = active_time.split('.')[0].replace('T', ' ');
                          active_time = date_format(active_time,"mm/dd/yyyy HH:MM");
                          var created_date_on = data[event_key]['created'];
                          created_date_on = created_date_on.toISOString();
                          created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                          var created_on = date_format(created_date_on, "mm/dd/yyyy HH:MM");*/
                          var active_time = data[event_key]['modified'];
                          active_time = lib._time_zone_data(time_zone,active_time);

                           var created_date_on = data[event_key]['created'];
                           created_date_on = lib._time_zone_data(time_zone,created_date_on);
                           
                            last_event_arr[event_key] = {
                             
                              'user_id':data[event_key]['_id'],
                              'username':data[event_key]['username'],
                              'first_name':data[event_key]['first_name'],
                              'last_name':data[event_key]['last_name'],
                              'email_address':data[event_key]['email_address'],
                              'created_on':date_format(created_date_on, "mm/dd/yyyy HH:MM"),
                              'active_time':date_format(active_time, "mm/dd/yyyy HH:MM"),
                              'event_name':event_name
                            };
                            event_key++;
                            app_event_user_data_function(event_key);

                        }

                      }else{

                            if(last_event_arr.length>0)
                            {                  
                              response['authCode'] = apps_success_code;
                              response['authMessage'] = fetch_data;
                              response['params'] = last_event_arr;
                              response['total_count'] = count;
                              response['item_per_page'] = item_per_page;
                              res.json(response);
                            }else{
                              response['authCode'] = apps_error_code;
                              response['authMessage'] = user_data_not_found;
                              response['params'] = user_data_not_found;
                              res.json(response);
                            }
                      }

                    }
                    app_event_user_data_function(event_key);
                  });
              }
            }

          });

        } else {

              response['authCode'] = apps_error_code;
              response['authMessage'] = empty_sort_order_by;
              response['params'] = empty_sort_order_by;
              res.json(response);
        }
   
  });
  router.post('/:app_id/add_user_event', function(req, res, next) {

        var current_date_new = new Date();
        var current_date = new Date(current_date_new.getTime());
        var app_event_user_id = new ObjectID(req.headers.app_event_user_id);
        var event_id = new ObjectID(req.headers.event_id);
        var app_data_arr = {};
        var update_data_arr = {};
        var response = {};
        app_data_arr['app_event_user_id'] = app_event_user_id;
        app_data_arr['event_id'] = event_id;
        app_data_arr['status'] = 'active';
        app_data_arr['recent_status'] = 1;
        app_data_arr['created'] = current_date;
        app_data_arr['modified'] = current_date;
        update_data_arr['recent_status'] =0;
         connection.user_events.find({'app_event_user_id':new ObjectID(app_event_user_id),'status':'active'},function(err,user_data_ids){
            if(user_data_ids.length>0)
            {
            connection.user_events.update( { 'app_event_user_id' : new ObjectID(app_event_user_id) }, { '$set' : update_data_arr }, { multi: true }, function( err_update, result_update ) {
                });
            }
         });
         connection.user_events.find({'app_event_user_id':new ObjectID(app_event_user_id),'event_id':new ObjectID(event_id),'status':'active'},function(err,user_data_ids){
                if(user_data_ids.length==0)
                {
                  var save_apps_data_connection = connection.user_events(app_data_arr);

                   save_apps_data_connection.save( function( err, result ) {
                
                      response['authCode'] = apps_success_code;
                      response['authMessage'] = app_save;
                      response['params'] = app_save;
                      res.json(response);

                  });
               }else{
                      response['authCode'] = apps_error_code;
                      response['authMessage'] = event_already_exist;
                      response['params'] = event_already_exist;
                      res.json(response);
               }
          });

  });

  router.get('/:app_id', function(req, res, next) {

        var app_id = new ObjectID(req.params.app_id);
        var item_per_page = parseInt(req.headers.item_per_page);
        var offset = (req.headers.offset-1)*item_per_page;
        var sort_by = req.headers.sort_by;
        var order_by = parseInt(req.headers.order_by);
        var skip=parseInt(item_per_page)+parseInt(offset);

        time_zone_query(app_id,function( time_zone ) {
          
            var query_sort_data = [
                {
                  $project:
                  {
                    'username':1,'first_name':1,'last_name':1,'email_address':1,'status':1,'modified':1,'app_id':1,'created':1,'insensitive':1,
                    insensitive: { "$toUpper": "$"+sort_by}
                  }
                },
                 { "$sort": { "insensitive": order_by} }, 
                {
                  $match:{
                    $and:[{app_id:app_id},{'status':'active'}]
                },
              },
              { $limit : skip},
              {$skip:offset}];

            var response = {};
            if(lib.is_not_empty(sort_by) && lib.is_not_empty(order_by))
            {
              connection.app_event_users.count({'app_id':app_id,'status':'active'},function(err,count){
                app_event_users_data(count);
              });
              function app_event_users_data(count)
              {

                  connection.app_event_users.aggregate(query_sort_data,function(err,data){
                    var last_event_arr = [];
                    var event_key = 0;
                    function app_event_user_data_fun(event_key)
                    {
                      if(event_key<data.length)
                      {
                        connection.user_events.find({'app_event_user_id':new ObjectID(data[event_key]['_id']),'status':'active','recent_status':1},function(err,user_event_data){
                          
                            if(user_event_data.length>0)
                            {
                                connection.events.find({'_id':new ObjectID(user_event_data[0]['event_id']),'status':'active','app_id':app_id},function(err,event_data){
                                    if(event_data.length>0)
                                    {
                                        event_name_function(event_data[0]['event_name']);
                                    }else{
                                       event_name_function("-");
                                    }
                                    
                                });
                            }else{
                                  event_name_function("-");
                            }                  

                        }).sort({created : -1 }).limit(1);
                        function event_name_function(event_name)
                        {
                          var active_time = lib._time_zone_data(time_zone,data[event_key]['modified']);
                         /* active_time = active_time.toISOString();
                          active_time = active_time.split('.')[0].replace('T', ' ');
                          active_time = date_format(active_time,"mm/dd/yyyy HH:MM");*/
                          //active_time = active_time;
                          var created_date_on_old = data[event_key]['created'];
                          /*created_date_on = created_date_on.toISOString();
                          created_date_on = created_date_on.split('.')[0].replace('T', ' ');*/
                          var created_on = lib._time_zone_data(time_zone,created_date_on_old);/*date_format(created_date_on, "mm/dd/yyyy HH:MM")*/
                          last_event_arr[event_key] = {
                            'user_id':data[event_key]['_id'],
                            'username':data[event_key]['username'],
                            'first_name':data[event_key]['first_name'],
                            'last_name':data[event_key]['last_name'],
                            'email_address':data[event_key]['email_address'],
                            'created_on':date_format(created_on, "mm/dd/yyyy HH:MM"),
                            'active_time':date_format(active_time, "mm/dd/yyyy HH:MM"),
                            'event_name':event_name
                          };
                          event_key++;
                          app_event_user_data_fun(event_key);
                        }

                      }else{
                          if(last_event_arr.length>0)
                          {
                              response['authCode'] = apps_success_code;
                              response['authMessage'] = fetch_data;
                              response['params'] = last_event_arr;
                              response['total_count'] = count;
                              //response['item_per_page'] = item_per_page;
                              res.json(response);
                          }else{
                              response['authCode'] = apps_error_code;
                              response['authMessage'] = user_data_not_found;
                              response['params'] = user_data_not_found;
                              res.json(response);
                          }
                      }

                    }

                    app_event_user_data_fun(event_key);

                  })/*.sort({[sort_by]:order_by}).skip(offset).limit(item_per_page)*/;

              }

            }else{

                response['authCode'] = apps_error_code;
                response['authMessage'] = empty_sort_order_by;
                response['params'] = empty_sort_order_by;
                res.json(response);
            }

        });

  });

 router.get('/data/data/:app_id/:search_string', function(req, res, next) {

        var current_date_new = new Date();
        var current_date = new Date(current_date_new.getTime());
        var app_id = new ObjectID(req.params.app_id);
        var item_per_page = parseInt(req.headers.item_per_page);
        var offset = (req.headers.offset-1)*item_per_page;
        var sort_by = req.headers.sort_by;
        var order_by = parseInt(req.headers.order_by);
        var search_string = req.params.search_string;
        var skip=parseInt(item_per_page)+parseInt(offset);
 
            //var monthYearDay = lib.getMonthDateYear(search_string);
           // var type = req.headers.type;
            var response = {};

             /* var user_data_query1 = {$and: [{ "app_id" : app_id},{ "status" : 'active'},{$or:[{'username':{'$regex':search_string,$options: '-i'}},{$where : 'return this.created.getMonth() == parseInt("'+monthYearDay['month']+'")'},{$where : 'return this.created.getYear() == parseInt("'+monthYearDay['year']+'")'},{$where : 'return this.created.getDate() == parseInt('+monthYearDay['day']+')'},{'email_address':{'$regex':search_string,$options: '-i'}},{'last_name':{'$regex':search_string,$options: '-i'}},{'first_name':{'$regex':search_string,$options: '-i'}}]}]};*/
            var user_data_query1 =   
            [
              {
                $project:
                {
                  //find value for created date
                  day_created: { $substr: [ "$created", 8, 2 ] },
                  second_created:{$second:"$created"},
                  year_created:{$year:"$created"},
                  month_created:{$month:"$created"},
                  hour_created:{$hour:"$created"},
                  minute_created:{$minute:"$created"},
                  //find value for modified
                  day_modified: { $substr: [ "$created", 8, 2 ] },
                  second_modified:{$second:"$modified"},
                  year_modified:{$year:"$modified"},
                  month_modified:{$month:"$modified"},
                  hour_modified:{$hour:"$modified"},
                  minute_modified:{$minute:"$modified"},
                  //'username':1,'first_name':1,'last_name':1,'email_address':1,'status':1,'app_id':1,'created':1,'modified':1,'status':1,
                  insensitive: { "$toUpper": "$"+sort_by}
                }
              }, 
                {
                  $match:{
                    $and:[{app_id:app_id},{'status':'inactive'}],
                    $or:[
                         // {minutes:{"$minute":[search_string]}},
                         //find data by created date

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
                          {app_event_users: {"$elemMatch": {'username': {'$regex':search_string,$options: '-i'}}}},
                          //{'app_event_users.username':{'$regex':search_string,$options: '-i'}},
                          /*{'email_address':{'$regex':search_string,$options: '-i'}},
                          {'last_name':{'$regex':search_string,$options: '-i'}},
                          {'first_name':{'$regex':search_string,$options: '-i'}}*/
                        ]
                }   
              },

            ];
          connection.user_events.find(user_data_query1)
            .populate('app_event_user_id')
            .populate('event_id')
            .exec(function(error, posts) {
                res.send(posts);
            })
          // find arr for user_id
          
   
  });

  router.post('/status', function(req, res, next) {

    var send_email = Send_Email_Scoping_Install_Attachement('anupam.jangir@wedigtech.com',"hello anupam", "this is my last message", "Reebonz.pdf");
    res.send("hello anupam");


  });      

  function Send_Email_Scoping_Install_Attachement(emailTo, subject, message, attachmentsName) {

   
    var nodemailer = require('nodemailer');
    var sesTransport = require('nodemailer-ses-transport');
    // create reusable transport method (opens pool of SMTP connections)
    var SESCREDENTIALS = {
        accessKeyId: "AKIAIYEXAMKQMCDZU3JQ",
        secretAccessKey: "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"
    };

    var transporter = nodemailer.createTransport(sesTransport({
        transportMethod: "SES",
        //secureConnection:false,
        accessKeyId: SESCREDENTIALS.accessKeyId,
        secretAccessKey: SESCREDENTIALS.secretAccessKey,
        "region": "us-west-2"
        //rateLimit: 5,

    }));

    // build attachments array
    var fs = require('fs');
    var attachments = [];

   
    var date = new Date();
    var dateString = date.toString();
    //subject = subject + " at: " + dateString;
    console.log(emailTo);

    var mailOptions = {
        from:  global_Email_From,   // sender address
        to: emailTo,                     // list of receivers
        subject: subject,                       // Subject line
        html: message,                            // plaintext body
        attachments: [{   // file on disk as an attachment
            filename: attachmentsName,
            //streamSource: fs.createReadStream('./upload/mail/' + attachmentsName)
            path:"./uploads/"+ attachmentsName,
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            // stream this file

        }]
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) { console.error(error);datchkr.WriteErrorLogs('error', 'email_template', 'send_email', err); }
        else { console.log("Message sent: " + response.message); }
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
    console.log('Emailed!!!');
}
  module.exports = router;