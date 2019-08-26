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
  var response = {};
  if(lib.is_not_empty(req.headers.event_id) && lib.is_not_empty(req.headers.app_id))
  {
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var title = req.headers.title;
    var event_id = new ObjectID(req.headers.event_id);
    var action = req.headers.action;
    var app_id = new ObjectID(req.headers.app_id);
    var operator_data_set = req.body.operator_data_set;
    var email_address = req.headers.email_address;
    var action_type = req.headers.action_type;
    var shedultedReportData = req.body.shedultedReportData;

    connection.events.find({'_id':event_id,'status':'active'},function(err,event_id_exist){
      if(event_id_exist.length>0)
      {
        random_event_func(event_id_exist[0]['random_event_id']);
      }else{
        random_event_func('');
      }
      
    });
    function random_event_func(random_event_id)
    {
      var operator_data_arr = {};
      operator_data_arr['title'] = title;
      operator_data_arr['action_type'] = action_type;
      operator_data_arr['event_id'] = event_id;
      operator_data_arr['action'] = action;
      operator_data_arr['app_id'] = app_id;
      operator_data_arr['status'] = 'active';
      operator_data_arr['operator_data_set'] = operator_data_set;
      operator_data_arr['random_event_id'] = random_event_id;
      operator_data_arr['created'] = current_date;
      operator_data_arr['modified'] = current_date;
      operator_data_arr['email_address'] = email_address;
      operator_data_arr['shedulted_reportdata'] = shedultedReportData;
      //res.send(operator_data_arr);
      connection.monitors.find({'app_id':app_id,'status':'active','title':title},function(err,monitor_name_exist){

          if(monitor_name_exist.length>0)
          {
              response['authCode'] = apps_error_code;
              response['authMessage'] = monitor_name_exist_data;
              response['params'] = monitor_name_exist_data;
              res.json(response);

          }else{
            var save_events_data_connection = connection.monitors(operator_data_arr);
            save_events_data_connection.save( function( err, result ) {

                  response['authCode'] = apps_success_code;
                  response['authMessage'] = monitor_saved;
                  response['params'] = monitor_saved;
                  res.json(response);

            });
        }
      });
    }
  }else{
    if(!lib.is_not_empty(event_id))
    {
      response['authCode'] = apps_error_code;
      response['authMessage'] = empty_event_name;
      response['params'] = empty_event_name;
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
  if(lib.is_not_empty(req.headers.event_id) && lib.is_not_empty(req.headers.app_id))
  {
      //---- ----perameters----------------
      var current_date_new = new Date();
      var current_date = new Date(current_date_new.getTime());

      var monitor_id = req.params.monitor_id;
      var title = req.headers.title;
      var event_id = new ObjectID(req.headers.event_id);
      var action = req.headers.action;
      var app_id = new ObjectID(req.headers.app_id);
      var operator_data_set = req.body.operator_data_set;
      var email_address = req.headers.email_address;
      var action_type = req.headers.action_type;
      var shedultedReportData = req.body.shedultedReportData;
      //-------end here------
      connection.events.find({'_id':event_id,'status':'active'},function(err,event_id_exist){
      
        if(event_id_exist.length>0)
        {
          random_event_func(event_id_exist[0]['random_event_id']);
        }else{
          random_event_func('');
        }
        
      });
      function random_event_func(random_event_id)
      {
        var operator_data_arr = {};
        operator_data_arr['title'] = title;
        operator_data_arr['action_type'] = action_type;
        operator_data_arr['event_id'] = event_id;
        operator_data_arr['action'] = action;
        operator_data_arr['app_id'] = app_id;
        operator_data_arr['random_event_id'] = random_event_id;
        operator_data_arr['status'] = 'active';
        operator_data_arr['operator_data_set'] = operator_data_set;
        operator_data_arr['modified'] = current_date;
        operator_data_arr['email_address'] = email_address;
        operator_data_arr['shedulted_reportdata'] = shedultedReportData;
        //res.send(operator_data_arr);
        connection.monitors.find({'_id':{$ne:monitor_id},'app_id':app_id,'title':title,'status':'active'},function(err,monitor_name_exist){

          if(monitor_name_exist.length>0)
          {
              response['authCode'] = apps_error_code;
              response['authMessage'] = monitor_name_exist_data;
              response['params'] = monitor_name_exist_data;
              res.json(response);

          }else{

              connection.monitors.update( { '_id' : new ObjectID(monitor_id) }, { '$set' : operator_data_arr }, { upsert: true }, function( err_update, result_update ) {

                  response['authCode'] = apps_success_code;
                  response['authMessage'] = update_monitor_data;
                  response['params'] = update_monitor_data;
                  res.json(response);

            });

          }
        });
      }
       
    }else{
        if(!lib.is_not_empty(event_id))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_event_name;
          response['params'] = empty_event_name;
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
                      '_id':1,'title':1,'action':1,'event_id':1,'operator_data_set':1,'status':1,'app_id':1,'created':1,'modified':1,'insensitive':1,
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
    connection.monitors.count(monitor_data_query_count,function(err,monitor_data_count){
      monitor_data_count_function(monitor_data_count);
    })
    function monitor_data_count_function(monitor_data_count)
    {
      connection.monitors.aggregate(monitor_data_query,function(err,monitor_data_exist){

          function monitor_data(monitor_key)
          {
            if(monitor_key<monitor_data_exist.length){

                connection.events.find({'_id':new ObjectID(monitor_data_exist[monitor_key]['event_id']),'status':'active'},function(err,event_data_exist){
                  var event_name;
                  if(event_data_exist.length>0)
                  {
                    event_name = event_data_exist[0]['event_name'];
                  }else{
                    event_name = "";
                  }
                  
                  var shedulted_reportdata = "";
                  if(lib.is_not_empty(monitor_data_exist[monitor_key]['shedulted_reportdata'])){

                    shedulted_reportdata = monitor_data_exist[monitor_key]['shedulted_reportdata'][0];
                  }
                  monitor_arr[monitor_key] = {

                    "monitor_id":monitor_data_exist[monitor_key]['_id'],
                    "events":event_name,
                    "title":monitor_data_exist[monitor_key]['title'],
                    "event_id":monitor_data_exist[monitor_key]['event_id'],
                    "action":monitor_data_exist[monitor_key]['action'],
                    "type":monitor_data_exist[monitor_key]['type'],
                    "operator_data_set":monitor_data_exist[monitor_key]['operator_data_set'],
                    "shedultedReportData":shedulted_reportdata,
                    "action_type":monitor_data_exist[monitor_key]['action_type']
                    
                  };
                  //console.log(monitor_arr);
                  //evnt_data_found(monitor_arr);
                  event_data_query();
                });

            }else{
                //res.send(monitor_arr);
                if(monitor_arr.length>0)
                {
                  response['authCode'] = apps_success_code;
                  response['monitor_data_count']=monitor_data_count;
                  response['authMessage'] = fetch_data;
                  response['params'] = monitor_arr;
                  res.json(response);

                } else {

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

    response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());
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
        connection.monitors.update( { '_id' : new ObjectID(monitor_user_arr[i]) }, { '$set' : monitor_data_arr }, { upsert: true }, function( err_update, result_update ) {
        
        });

      }

       response['authCode'] = apps_success_code;
       response['authMessage'] = Data_delete;
       response['params'] = Data_delete;
       res.json(response);

     } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = delete_id_str_event;
        response['params'] = delete_id_str_event;
        res.json(response);
     }

});
router.get('/monitor/:monitor_id', function(req, res, next) {
  
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());
  var monitor_id = req.params.monitor_id;
  var response = {};
  var monitor_key = 0;
  var monitor_arr = [];
  connection.monitors.find({'_id':new ObjectID(monitor_id),'status':'active'},function(err,monitor_data_exist){

      function monitor_data(monitor_key)
      {
        if(monitor_key<monitor_data_exist.length){

            connection.events.find({'_id':new ObjectID(monitor_data_exist[monitor_key]['event_id']),'status':'active'},function(err,event_data_exist){

              var shedulted_reportdata = "";
              if(lib.is_not_empty(monitor_data_exist[monitor_key]['shedulted_reportdata'])){

                shedulted_reportdata = monitor_data_exist[monitor_key]['shedulted_reportdata'][0];
              }
              monitor_arr[monitor_key] = {
                "monitor_id":monitor_data_exist[monitor_key]['_id'],
                "event_id":monitor_data_exist[monitor_key]['event_id'],
                "title":monitor_data_exist[monitor_key]['title'],
                "action":monitor_data_exist[monitor_key]['action'],
                "type":monitor_data_exist[monitor_key]['type'],
                "email_address":monitor_data_exist[monitor_key]['email_address'],
                "operator_data_set":monitor_data_exist[monitor_key]['operator_data_set'],
                "shedultedReportData":shedulted_reportdata,
                "action_type":monitor_data_exist[monitor_key]['action_type']
                
                
              };
              //console.log(monitor_arr);
              //evnt_data_found(monitor_arr);
              event_data_query();
            });

        } else {
            if(monitor_arr.length>0)
            {
                response['authCode'] = apps_success_code;
                response['authMessage'] = fetch_data;
                response['params'] = monitor_arr;
                res.json(response);

            } else {

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

router.get('/track/search/:monitor_id', function(req, res, next) {
    //start the parameters here
    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    if(lib.is_not_empty(req.headers.item_per_page) && lib.is_not_empty(req.headers.offset))
    {
      var monitor_id = req.params.monitor_id;
      //var event_id = new ObjectID(req.headers.event_id);
      var search_string = req.headers.search_string;
      var select_fields_str = req.headers.select_fields_str;
      var item_per_page = parseInt(req.headers.item_per_page);
      var offset = (req.headers.offset-1)*item_per_page;
      var skip=parseInt(item_per_page)+parseInt(offset);
      var no_of_days = req.headers.no_of_days;
      var start_date = req.headers.start_date;
      var end_date = req.headers.end_date;
      //var sort_by = req.headers.sort_by;
      //var order_by = parseInt(req.headers.order_by);

      //end of the parameters here
      var track_data_arr = [];
      var track_key = 0;
      var track__data_key = 0;
      var keyss = [];
      var like_query_var = [];
      var select_arrays = select_fields_str.split(',');
      //console.log(select_arrays);
      if(lib.is_not_empty(monitor_id) && lib.is_not_empty(search_string) && lib.is_not_empty(select_arrays))
      {
        connection.monitors.find( {'_id': new ObjectID(monitor_id),'status':'active'} ,function(err,monitor_data){
          if(monitor_data.length>0)
          {
            var event_id = new ObjectID(monitor_data[0]['event_id']);
            fetch_event_data_funtion(event_id);
          }else{
            var event_id = new ObjectID('57e0debc49207e3c0127b956');
            fetch_event_data_funtion(event_id);
          }
        });
        function fetch_event_data_funtion(event_id)
        {
          //Search data according to date filters
            if(lib.is_not_empty(no_of_days))
            {
              if(no_of_days!='custom')
              {
                time_before_days = new Date(current_date.getTime() + (-no_of_days*24*60*60*1000));
                current_date_time = current_date;
              
              } else {

                var start_date_format = date_format(start_date, "yyyy-mm-dd'T'HH:MM:ss'Z'");
                var end_date_format = date_format(end_date, "yyyy-mm-dd'T'HH:MM:ss'Z'");

                //console.log(start_date_format);
                  /*var start_date = start_date.split('.')[0].replace(' ', 'T');
                  var end_date  = end_date.split('.')[0].replace(' ','T');*/
                  time_before_days = start_date_format;
                  current_date_time = end_date_format;

              }
              var event_data_query13 = [{'status':'active'},{'event_id':event_id},{'monitor_id_str':{'$regex':monitor_id,$options: '-i'}},{'last_time':{$gte:time_before_days, $lte:current_date_time}}];

            }else{

              var event_data_query13 = [{'monitor_id_str':{'$regex':monitor_id,$options: '-i'}},{'status':'active'},{'event_id':event_id}];
            }
           //End of the code here
            var search_string_str  ={'$regex':search_string,$options: '-i'};
            for(var arr = 0;arr<select_arrays.length;arr++)
            {
              var user_event_arr = {[select_arrays[arr]]:search_string_str};
              like_query_var[arr] = {'event_data': {"$elemMatch": user_event_arr}};
            }
             var event_data_query =   [
             {$project:{
              '_id':1,'event_id':1,'event_slug':1,'total_count':1,'object_label':1,'current_link':1,'browser':1,'os':1,'random_app_id':1,'screen_size':1,'history_count':1,'status':1,'type':1,'last_triggred':1,'status':1,'app_id':1,'created':1,'modified':1,'random_event_id':1,'page_title':1,'last_time':1,'config_data':1,'event_data':1,'insensitive':1,'monitor_id_str':1,insensitive: { "$toUpper": "$browser"
              }}}, 
             {
                $match:{
                  $and:event_data_query13,
                  $or:like_query_var                     
              }   
            },
            //{ "$sort": { ["event_data."+sort_by]:order_by} },
            { $limit : skip},
            {$skip:offset}
          ];
           var event_data_query_count =    
              {

                  $and:event_data_query13,
                  $or:like_query_var                     
                
            };
          connection.user_tracks.count(event_data_query_count ,function(err,data_count){
            
            total_track_record_count(data_count);
          });
          function total_track_record_count(data_count)
          { 
            connection.user_tracks.aggregate(event_data_query ,function(err,data){//console.log(data);
             connection.events.find({'_id':event_id,'status':'active'},function(err,unique_data_arr){
               if(unique_data_arr.length>0)
               {
                  var key_uni_event_arr = unique_data_arr[0]['fields'];
                  user_keyss_event_arr_function(key_uni_event_arr);
               }else{
                  user_keyss_event_arr_function("");
               }
             });
             function user_keyss_event_arr_function(key_uni_event_arr)
             {
               function tack_unique_key(track__data_key)
               {
                  if(track__data_key<data.length)
                  {
                    for (var item in data[track__data_key]['event_data']) {
                          for (var item_key in data[track__data_key]['event_data'][item]) {
                            if(item_key!='type')
                            {
                              keyss.push(item_key);
                            }
                          }
                        }
                         track__data_key++;
                        tack_unique_key(track__data_key);
                  }else{
                    function sort_unique(arr) {
                        return arr.sort().filter(function(el,i,a) {
                            return (i==a.indexOf(el));
                        });
                    }
                    var key_uni_arr = sort_unique(keyss);
                    user_keyss_arr_function(key_uni_event_arr,key_uni_arr);
                    //res.send(key_uni_arr);
                    //console.log(key_uni_arr);
                  }

               }

                tack_unique_key(track__data_key);
             }
             function user_keyss_arr_function(unique_keyss_arr,key_uni_event_arr)
             {
               function track_user_data(track_key)
               {
                  if(track_key<data.length)
                  {

                     connection.events.find( {'_id': new ObjectID(data[track_key]['event_id']),'status':'active'} ,function(err,event_data){
                        var event_name;
                        if(event_data.length>0)
                        {
                          event_name = event_data[0]['event_name'];
                        }else{
                          event_name = "";
                        }
                         var uniq_new_arr = [];
                         var unique_data_object = {};
                        for(p=0;p<unique_keyss_arr.length;p++)
                        {
                          //console.log(data[track_key]['event_data']);
                          var event_user_track_data;
                          if(data[track_key]['event_data'][0][unique_keyss_arr[p]]==undefined)
                          {
                            event_user_track_data = "-";
                          }else{
                            var tempData = {};
                            if(typeof(data[track_key]['event_data'][0][unique_keyss_arr[p]])=="object")
                            { 
                              data[track_key]['event_data'][0][unique_keyss_arr[p]]['track_id'] = data[track_key]['_id'];
                            }
                            event_user_track_data = data[track_key]['event_data'][0][unique_keyss_arr[p]];
                          }
                          //console.log(unique_keyss_arr[p]);
                          unique_data_object[[unique_keyss_arr[p]]] = event_user_track_data;
                          //uniq_new_arr[p] = unique_data_object;
                        }
                        uniq_new_arr[0] = unique_data_object;
                        track_data_arr[track_key]={

                        'event_data' : uniq_new_arr
                      };

                       track_key++;
                        track_user_data(track_key);
                     });

                   
                  }else{

                      response['authCode'] = apps_success_code;
                      response['authMessage'] = fetch_data;
                      response['params'] = track_data_arr;
                      response['key_arr'] = unique_keyss_arr;
                      response['selected_keys'] = key_uni_event_arr;
                      response['total_count'] = data_count;
                      res.json(response);
                  }
               }
                track_user_data(track_key);
             }

            });
          }
        }
      }else{
            response['authCode'] = apps_error_code;
            response['authMessage'] = like_all_fields;
            response['params'] = like_all_fields;
            res.json(response);
      }
    }else{
       
        response['authCode'] = apps_error_code;
        response['authMessage'] = item_per_page_offset;
        response['params'] = item_per_page_offset;
        res.json(response);
    }
});
router.get('/track/:monitor_id', function(req, res, next) {
    //start the parameters here
    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());
    
    if(lib.is_not_empty(req.headers.item_per_page) && lib.is_not_empty(req.headers.offset))
    {
      
      var monitor_id = req.params.monitor_id;
      //var event_id = new ObjectID(req.headers.event_id);
      //var select_fields_str = req.headers.select_fields_str;
      var item_per_page = parseInt(req.headers.item_per_page);
      var offset = (req.headers.offset-1)*item_per_page;
      var skip=parseInt(item_per_page)+parseInt(offset);
      var no_of_days = req.headers.no_of_days;
      var start_date = req.headers.start_date;
      var end_date = req.headers.end_date;
      //var sort_by = req.headers.sort_by;
      //var order_by = parseInt(req.headers.order_by);

      //end of the parameters here
      var track_data_arr = [];
      var track_key = 0;
      var track__data_key = 0;
      var keyss = [];
      //var like_query_var = [];
      //var select_arrays = select_fields_str.split(',');
      //console.log(select_arrays);
      if(lib.is_not_empty(monitor_id))
      {
        //Find event id by monitor id
        connection.monitors.find( {'_id': new ObjectID(monitor_id),'status':'active'} ,function(err,monitor_data){
          if(monitor_data.length>0)
          {
            var event_id = new ObjectID(monitor_data[0]['event_id']);
            fetch_event_data_funtion(event_id);
          }else{
            var event_id = new ObjectID('57e0debc49207e3c0127b956');
            fetch_event_data_funtion(event_id);
          }
        });
        function fetch_event_data_funtion(event_id)
        {
          //Search data according to date filters
            if(lib.is_not_empty(no_of_days))
            {
              if(no_of_days!='custom')
              {
                time_before_days = new Date(current_date.getTime() + (-no_of_days*24*60*60*1000));
                current_date_time = current_date;
              
              }else{
                var start_date_format = date_format(start_date, "yyyy-mm-dd'T'HH:MM:ss'Z'");
                var end_date_format = date_format(end_date, "yyyy-mm-dd'T'HH:MM:ss'Z'");

                //console.log(start_date_format);
                  /*var start_date = start_date.split('.')[0].replace(' ', 'T');
                  var end_date  = end_date.split('.')[0].replace(' ','T');*/
                  time_before_days = start_date_format;
                  current_date_time = end_date_format;

              }
              var event_data_query13 = [{'monitor_id_str':{'$regex':monitor_id,$options: '-i'}},{'status':'active'},{'event_id':event_id},{'last_time':{$gte:time_before_days, $lte:current_date_time}}];

            }else{

              var event_data_query13 = [{'monitor_id_str':{'$regex':monitor_id,$options: '-i'}},{'status':'active'},{'event_id':event_id}];
            }
            //End of the code here
           /* for(var arr = 0;arr<select_arrays.length;arr++)
            {
              like_query_var[arr] = {event_data: {"$elemMatch": {[select_arrays[arr]]: {'$regex':search_string,$options: '-i'}}}};
            }*/
             var event_data_query =   [
             {$project:{
              '_id':1,'event_id':1,'event_slug':1,'total_count':1,'object_label':1,'current_link':1,'browser':1,'os':1,'random_app_id':1,'screen_size':1,'history_count':1,'status':1,'type':1,'last_triggred':1,'status':1,'app_id':1,'created':1,'modified':1,'random_event_id':1,'page_title':1,'last_time':1,'config_data':1,'event_data':1,'insensitive':1,'monitor_id_str':1,insensitive: { "$toUpper": "$browser"
              }}}, 
             {
                $match:{
                  $and:event_data_query13,
                  //$or:like_query_var                     
              }   
            },
            //{ "$sort": { ["event_data."+sort_by]:order_by} },
            { $limit : skip},
            {$skip:offset}
          ];
           var event_data_query_count =    
              {

                  $and:event_data_query13,
                 // $or:like_query_var                     
                
            };
          connection.user_tracks.count(event_data_query_count ,function(err,data_count){
            
            total_track_record_count(data_count);
          });
          function total_track_record_count(data_count)
          { 
            connection.user_tracks.aggregate(event_data_query ,function(err,data){//console.log(data);
             connection.events.find({'_id':event_id,'status':'active'},function(err,unique_data_arr){
               if(unique_data_arr.length>0)
               {
                  var key_uni_event_arr = unique_data_arr[0]['fields'];
                  user_keyss_event_arr_function(key_uni_event_arr);
               }else{
                  user_keyss_event_arr_function("");
               }
             });
             function user_keyss_event_arr_function(key_uni_event_arr)
             {
               function tack_unique_key(track__data_key)
               {
                  if(track__data_key<data.length)
                  {
                    for (var item in data[track__data_key]['event_data']) {
                          for (var item_key in data[track__data_key]['event_data'][item]) {
                            if(item_key!='type')
                            {
                              keyss.push(item_key);
                            }
                          }
                        }
                         track__data_key++;
                        tack_unique_key(track__data_key);
                  }else{
                    function sort_unique(arr) {
                        return arr.sort().filter(function(el,i,a) {
                            return (i==a.indexOf(el));
                        });
                    }
                    var key_uni_arr = sort_unique(keyss);
                    user_keyss_arr_function(key_uni_event_arr,key_uni_arr);
                    //res.send(key_uni_arr);
                    //console.log(key_uni_arr);
                  }

               }

                tack_unique_key(track__data_key);
             }
             function user_keyss_arr_function(unique_keyss_arr,key_uni_event_arr)
             {
               function track_user_data(track_key)
               {
                  if(track_key<data.length)
                  {

                     connection.events.find( {'_id': new ObjectID(data[track_key]['event_id']),'status':'active'} ,function(err,event_data){
                        var event_name;
                        if(event_data.length>0)
                        {
                          event_name = event_data[0]['event_name'];
                        }else{
                          event_name = "";
                        }
                         var uniq_new_arr = [];
                         var unique_data_object = {};
                        for(p=0;p<unique_keyss_arr.length;p++)
                        {
                          //console.log(data[track_key]['event_data']);
                          var event_user_track_data;
                          if(data[track_key]['event_data'][0][unique_keyss_arr[p]]==undefined)
                          {
                            event_user_track_data = "-";
                          }else{
                            var tempData = {};
                            if(typeof(data[track_key]['event_data'][0][unique_keyss_arr[p]])=="object")
                            { 
                              data[track_key]['event_data'][0][unique_keyss_arr[p]]['track_id'] = data[track_key]['_id'];
                            }
                            event_user_track_data = data[track_key]['event_data'][0][unique_keyss_arr[p]];
                          }
                          //console.log(unique_keyss_arr[p]);
                          unique_data_object[[unique_keyss_arr[p]]] = event_user_track_data;
                          //uniq_new_arr[p] = unique_data_object;
                        }
                        uniq_new_arr[0] = unique_data_object;
                        track_data_arr[track_key]={

                        'event_data' : uniq_new_arr
                      };

                       track_key++;
                        track_user_data(track_key);
                     });

                   
                  }else{

                      response['authCode'] = apps_success_code;
                      response['authMessage'] = fetch_data;
                      response['params'] = track_data_arr;
                      response['key_arr'] = unique_keyss_arr;
                      response['selected_keys'] = key_uni_event_arr;
                      response['total_count'] = data_count;
                      res.json(response);
                  }
               }
                track_user_data(track_key);
             }

            });
          }
        }
      }else{
            response['authCode'] = apps_error_code;
            response['authMessage'] = like_all_fields;
            response['params'] = like_all_fields;
            res.json(response);
      }
    }else{
       
        response['authCode'] = apps_error_code;
        response['authMessage'] = item_per_page_offset;
        response['params'] = item_per_page_offset;
        res.json(response);
    }
});
module.exports = router;