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

router.get('/top_events/:app_id', function(req, res, next) {

 
  var app_id = new ObjectID(req.params.app_id);
  var no_of_days = req.headers.no_of_days;
  
  
  var response = {};

  var date_arr = [];

  time_zone_query(app_id,function( time_zone ) {

    var current_date_new = new Date();
    var current_date_new = new Date(current_date_new.getTime());
    var current_date = lib._time_zone_data( time_zone, current_date_new );
    current_date = new Date(current_date);
    day_month_query = { format: "%Y-%m-%d", date: "$last_time" };
    var date_format_r = "yyyy-mm-dd";
    for( var i=0; i < no_of_days; i++ ) {

      var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
      created_date_on = created_date_on.toISOString();
      created_date_on = created_date_on.split('.')[0].replace('T', ' ');
      created_date_on = date_format(created_date_on, date_format_r);
      date_arr[i] = created_date_on;
    
    }
    //var current_date = lib._time_zone_data( time_zone,current_date_new );
    //current_date = new Date(current_date);

    if(no_of_days==7)
    {

      time_before_days = new Date(current_date_new.getTime() + (-7*24*60*60*1000));

    } else { 

      time_before_days = new Date(current_date_new.getTime() + (-30*24*60*60*1000));
    }

    var current_date_new = new Date(current_date_new.getTime() + (+5*60*1000));
    connection.events.find({'app_id':app_id,'status':'active','last_triggred':{$gte: time_before_days, $lt:current_date_new}},function(err,top_event_data){

       event_key = 0;
       var top_event_ar= [];
       function top_event_data_fetch(event_key)
       {
          if(event_key<top_event_data.length)
          {
            var last_triggred;
            if(lib.is_not_empty(top_event_data[event_key]['last_triggred']))
            {
                //last_triggred = lib.time_format(top_event_data[event_key]['last_triggred']);
                last_triggred = top_event_data[event_key]['last_triggred'];

            }else{
                last_triggred = "";
            }
            var last_triggred_date;
            if(last_triggred!="10 November,11 23:41"){

              last_triggred_date = lib._time_zone_data(time_zone,last_triggred);
            }else{
              last_triggred_date = "-";
            }

            top_event_ar[event_key] = {

              "event_id":top_event_data[event_key]['_id'],
              "event_slug":top_event_data[event_key]['event_slug'],
              "event_name":top_event_data[event_key]['event_name'],
              "total_count":top_event_data[event_key]['total_count'],
              "last_triggred":date_format(last_triggred_date,'dd/mm/yyyy hh:MM:ss TT'),
            }

            event_key++;
            top_event_data_fetch(event_key);

          } else {

            if(top_event_ar.length>0)
            {
              var date_range = lib.start_end_date( date_arr , "is_day");
              response['authCode'] = apps_success_code;
              response['authMessage'] = fetch_data;
              response['params'] = top_event_ar;
              response['date_range'] = date_range;
              res.json(response);

            } else {

              response['authCode'] = apps_error_code;
              response['authMessage'] = top_event_data_not;
              response['params'] = top_event_data_not;
              res.json(response);
            }

          }        
          
       }
          
        top_event_data_fetch(event_key);

    }).sort({ 'total_count' : -1 }).limit(5);
  
  });

});
//Find average of event_id
router.get('/average/:app_id', function(req, res, next) {

  var app_id = new ObjectID(req.params.app_id);
  var no_of_days = req.headers.no_of_days;
  var event_id_str = req.headers.event_id_str;
  var start_date = req.headers.start_date;
  var end_date = req.headers.end_date;
  var day_month_wise = req.headers.day_month_wise;
  var response = {};

  time_zone_query(app_id,function( time_zone ) {

      var current_date_new = new Date();
      var current_date_new = new Date(current_date_new.getTime());

      var current_date = lib._time_zone_data( time_zone,current_date_new );
      current_date = new Date(current_date);
      //Find month according to time zone
      var year = date_format(current_date, "yyyy");
      var day = date_format(current_date, "dd");
      var day_month = lib.daysInMonth( day,year );

      var event_id_arr = [];
      var time_before_days;
      var current_date_new;
      if(no_of_days=='custom'){

          time_before_days = new Date(start_date.slice(1, -1));
          time_before_days = lib._time_zone_data( time_zone, time_before_days );
          time_before_days = new Date(time_before_days);  
          current_date_new = new Date(end_date.slice(1, -1));
          current_date_new = lib._time_zone_data( time_zone, current_date_new );
          current_date_new = new Date(current_date_new);

      } else {
          
          var loop_no_of_days;
          if(lib.is_not_empty(day_month_wise) && day_month_wise== 'is_month' ) {

            loop_no_of_days = no_of_days * day_month;
          
          } else {

            loop_no_of_days = no_of_days;
          }

          time_before_days = new Date(current_date_new.getTime() + (-loop_no_of_days*24*60*60*1000));  
          current_date_new = new Date(current_date_new.getTime() + (+7*60*1000));
      }
      var date_arr = [];
      var event_id_arr = event_id_str.split(',');

      connection.events.find({'app_id':app_id,'_id':{'$in':event_id_arr},'status':'active','last_triggred':{$gte: time_before_days, $lt:current_date_new}},function(err,top_event_data){
         
         event_key = 0;
         var top_event_ar= [];
         var total_sum  = 0;
         if(lib.is_not_empty(top_event_data)){
            for(var i=0;i<top_event_data.length;i++){
              
                total_sum += parseInt(top_event_data[i]['total_count']);
            }
         }
         function top_event_data_fetch(event_key)
         {
            if(event_key<top_event_data.length)
            {
              var last_triggred;
              if( lib.is_not_empty(top_event_data[event_key]['last_triggred']) )
              {
                  //last_triggred = lib.time_format(top_event_data[event_key]['last_triggred']);
                  last_triggred = lib._time_zone_data(time_zone,top_event_data[event_key]['last_triggred']);
              } else {
                  last_triggred = "";
              }
              var last_triggred_date;
              if(last_triggred!="10 November,11 23:41"){
                last_triggred_date = last_triggred;
              }else{
                last_triggred_date = "-";
              }
              
              
              
              top_event_ar[event_key] = {

                "event_id":top_event_data[event_key]['_id'],
                "event_slug":top_event_data[event_key]['event_slug'],
                "event_name":top_event_data[event_key]['event_name'],
                "percentage":Math.round((top_event_data[event_key]['total_count']/total_sum)*100),
                "last_triggred":last_triggred_date,
              }

              event_key++;
              top_event_data_fetch(event_key);

            }else{

              if(top_event_ar.length>0)
              {
                response['authCode'] = apps_success_code;
                response['authMessage'] = fetch_data;
                response['params'] = top_event_ar;
                res.json(response);

              }else{

                response['authCode'] = apps_error_code;
                response['authMessage'] = top_event_data_not;
                response['params'] = top_event_data_not;
                res.json(response);
              }

            }        
            
         }
            
          top_event_data_fetch(event_key);

      }).sort({ 'total_count' : -1 });
  });

});


router.get('/report_top_events/:app_id', function(req, res, next) {

    var app_id = new ObjectID(req.params.app_id);
    var no_of_days = req.headers.no_of_days;
    var event_id_str = req.headers.event_id_str;
    var start_date = req.headers.start_date;
    var end_date = req.headers.end_date;
    var day_month_wise = req.headers.day_month_wise;
    
    var response = {};

    time_zone_query(app_id,function( time_zone ) {
        
        var current_date_new = new Date();
        var current_date_new = new Date(current_date_new.getTime());

        var current_date = lib._time_zone_data( time_zone,current_date_new );
        current_date = new Date(current_date);
        //Find month according to time zone
        var year = date_format(current_date, "yyyy");
        var day = date_format(current_date, "dd");
        var day_month = lib.daysInMonth( day,year );

        var time_before_days;
        var current_date_new_s;
        if(no_of_days=='custom'){

            time_before_days = new Date(start_date.slice(1, -1));
            time_before_days = lib._time_zone_data( time_zone, time_before_days );
            time_before_days = new Date(time_before_days);  
            current_date_new_s = new Date(end_date.slice(1, -1));
            current_date_new_s = lib._time_zone_data( time_zone, current_date_new_s );
            current_date_new_s = new Date(current_date_new_s);

        }else{

            var loop_no_of_days;
            if(lib.is_not_empty(day_month_wise) && day_month_wise== 'is_month' ) {

              loop_no_of_days = no_of_days * day_month;
            
            } else {

              loop_no_of_days = no_of_days;
            }

            time_before_days = new Date(current_date_new.getTime() + (-loop_no_of_days*24*60*60*1000));  
            current_date_new_s = new Date(current_date_new.getTime() + (+7*60*1000));
        }
        var date_diff = current_date_new_s-time_before_days;
        var day_date_diff = Math.round(date_diff/(1000 * 60 * 60 * 24));
        var no_of_days_new;
        if( no_of_days=='custom' ) {
        
          no_of_days_new = day_date_diff;
        
        } else {

          no_of_days_new = no_of_days;
        
        }

        var day_month_query;
        var date_arr = [];
        var date_format_new;
        if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
            
            date_format_new = "mm/yyyy";
            day_month_query = { $substr: [ "$created", 0, 7 ] };
            
            for( var i=0; i < no_of_days_new; i++ ) {

              var date_i =  i*day_month;
              var created_date_on = new Date(current_date.getTime() + (-date_i*24*60*60*1000));
              created_date_on = created_date_on.toISOString();
              created_date_on = created_date_on.split('.')[0].replace('T', ' ');
              created_date_on = date_format(created_date_on, "yyyy-mm");
              date_arr[i] = created_date_on;
            
            }

        } else {
            
            date_format_new = "mm/dd/yyyy";
            day_month_query = { $substr: [ "$created", 0, 10 ] };
            for( var i=0; i < no_of_days_new; i++ ) {

              var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
              created_date_on = created_date_on.toISOString();
              created_date_on = created_date_on.split('.')[0].replace('T', ' ');
              created_date_on = date_format(created_date_on, "yyyy-mm-dd");
              date_arr[i] = created_date_on;
            
            }
        }

        var date_arr = date_arr.sort();
        if( lib.is_not_empty(event_id_str) ) {

            var event_arr = event_id_str.split(',');
            var event_id_arr = [];
            for( var h=0; h < event_arr.length; h++ ) {
                event_id_arr[h] = new ObjectID(event_arr[h]);
            }

            top_event_data_function(event_id_arr);

        } else {
          
            var event_id_arr_in = [];
            connection.events.find({'app_id':app_id,'status':'active','last_triggred':{$gte: time_before_days, $lt:current_date_new_s}},function(err,top_event_data_create){

                if(top_event_data_create.length>0) {

                    for(var k=0;k<top_event_data_create.length;k++) {

                        event_id_arr_in[k] = new ObjectID(top_event_data_create[k]['_id']);
                    }

                  top_event_data_function(event_id_arr_in);
                } else {
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = top_event_data_not;
                    response['params'] = top_event_data_not;
                    res.json(response);
                }
           }).sort({ 'total_count' : -1 }).limit(5);
        }

        function top_event_data_function(event_id_arr) {

            var key = 0;
            var event_tracks = {};
            function get_results ( key ) {

                if( key < event_id_arr.length ) {
                  
                    connection.user_tracks.aggregate({ $match: { 'app_id': app_id, 'event_id': event_id_arr[key], 'status': 'active', 'created': { $gte: time_before_days, $lt:current_date_new_s } } }, { $project : { day : day_month_query, event_id: 1 } }, { $group : { _id : { "event_id": "$event_id", "created": "$day" }, total : { $sum : 1 } } }, { "$sort": { "_id" : 1 } }, function( err, res_event_tracks ) {
                        //res.send(res_event_tracks);
                        if(res_event_tracks.length>0)
                        {
                            connection.events.find({'_id':new ObjectID(res_event_tracks[0]['_id']['event_id']),'status':'active'},function(err,result_event_name){
                                
                                if( result_event_name.length > 0 ) {

                                    event_tracks[res_event_tracks[0]['_id']['event_id']+'JAZZPRIT'+result_event_name[0]['event_name']] = res_event_tracks;
                                    //event_tracks[result_event_name[0]['event_id']];
                                } 
                               key ++;
                               get_results( key ); 
                            });
                        }else{
                             key ++;
                            get_results( key );
                        }
                        //get_results( key ); 
                    });
                } else {

                    var final_results = {};
                    for( var res_data in event_tracks ) {
                        var event_data = event_tracks[res_data];
                        var date_results = {};
                        for( var res_dates in date_arr ) {
                            date_results[date_arr[res_dates]] = 0;
                            for( var e_data in event_data ) {

                                var event_created_date = event_data[e_data]['_id']['created']; 
                                event_created_date = new Date(event_created_date);  
                                event_created_date = lib._time_zone_data( time_zone,event_created_date );
                                if(lib.is_not_empty(day_month_wise) && day_month_wise== 'is_day' ) {
                                
                                  event_created_date = date_format(event_created_date,'yyyy-mm-dd');    
                                
                                } else {

                                  event_created_date = date_format(event_created_date,'yyyy-mm'); 
                                } 

                                if( event_created_date == date_arr[res_dates] ) {

                                    date_results[date_arr[res_dates]] = event_data[e_data]['total'];
                                }
                            }
                        }

                        final_results[res_data] = date_results;
                    }

                    var results = [];
                    var i=0;
                    for( var send_res in final_results ) {

                        var v_data = [];
                        var v_dates = [];
                        for( var fin_res in final_results[send_res]) {

                            v_data.push(final_results[send_res][fin_res]);
                            v_dates.push(date_format(fin_res, date_format_new));
                        }
                        var e_id_name = send_res.split('JAZZPRIT');
                        var date_range = lib.start_end_date( date_arr ,day_month_wise );
                        results[i] = {
                            'event_id': e_id_name[0],
                            'event_name':e_id_name[1],
                            'data':v_data,
                            'date':v_dates,
                            "start_end_date":date_range
                        }
                        i++;
                    }

                    res.send(results);
                }
            } 

            get_results ( key );      
        }    
    });
});




/*router.get('/recent_users/:app_id/:no_of_days', function(req, res, next) {

 var app_id = new ObjectID(req.params.app_id);
  var no_of_days = req.params.no_of_days;
  var response = {};
  if(no_of_days==7)
  {

    time_before_days = new Date(current_date.getTime() + (-7*24*60*60*1000));

  }else{
    time_before_days = new Date(current_date.getTime() + (-30*24*60*60*1000));
  }
    connection.app_event_users.find({'app_id':app_id,'status':'active','created':{$gte: time_before_days, $lt:current_date}},function(err,top_user_data){
      //res.send(top_user_data);
      connection.app_event_users.aggregate(  {$match: {app_id:app_id,'status':'active'}}, {$group : {_id : { $substr: [ "$created", 0, 10 ] }, total : { $sum : 1 }}},{ "$sort": { "_id" : -1 } },function(err,registered_user){
        connection.events.find({'app_id':app_id,'status':'active'},function(err,app_data){
          var event_name; 
          if(app_data.length>0)
          {
            event_name = app_data[0]['event_name'];
          }else{
            event_name = "";
          }
          var recent_user_arr  = [];
          for(var i=0;i<top_user_data.length;i++)
          {
            var active_time = top_user_data[i]['modified'];
            active_time = active_time.toISOString();
            active_time = active_time.split('.')[0].replace('T', ' ');
            active_time = date_format(active_time,"HH:MM:ss");
            //res.send(app_data);
              //active_time = date_format(active_time,"HH:MM:ss");
              recent_user_arr[i] = {
                  "username":top_user_data[i]['username'],
                  "created":top_user_data[i]['created'],
                  "recent_events":event_name,
                  "active_time":active_time
              }
            
          }

          response['authCode'] = apps_success_code;
          response['authMessage'] = fetch_data;
          response['params'] = recent_user_arr;
          response['registered_user']= registered_user;
          res.json(response);
        }).sort({ 'created' : -1 }).limit(1);
    });
  }).sort({ 'total_count' : -1 }).limit(6);

});*/

router.get('/recent_users/:app_id', function(req, res, next) {

  var app_id = new ObjectID(req.params.app_id);
  var no_of_days = req.headers.no_of_days;
  var start_date = req.headers.start_date;
  var end_date = req.headers.end_date;
  var day_month_wise = req.headers.day_month_wise;
  var limit  = 5;
  
  var response = {};
  if(!lib.is_not_empty(no_of_days) && !lib.is_not_empty(app_id))
  {
     response['authCode'] = apps_error_code;
     response['authMessage'] = empty_app_id;
     response['params'] = empty_app_id;
     res.json(response);

  } else {

    time_zone_query(app_id,function( time_zone ) {
    
      var current_date_new = new Date();
      var current_date_new = new Date(current_date_new.getTime());

      var current_date = lib._time_zone_data( time_zone,current_date_new );
      current_date = new Date(current_date);
       //Find month according to time zone
      var year = date_format(current_date, "yyyy");
      var day = date_format(current_date, "dd");
      var day_month = lib.daysInMonth( day,year );
      
      var time_before_days;
      var current_date_new_s;

      if( no_of_days == 'custom' ) {

          time_before_days = new Date(start_date.slice(1, -1));
          time_before_days = lib._time_zone_data( time_zone, time_before_days );
          time_before_days = new Date(time_before_days);  
          current_date_new_s = new Date(end_date.slice(1, -1));
          current_date_new_s = lib._time_zone_data( time_zone, current_date_new_s );
          current_date_new_s = new Date(current_date_new_s);

      } else {

          var loop_no_of_days;
          if(lib.is_not_empty(day_month_wise) && day_month_wise== 'is_month' ) {

            loop_no_of_days = no_of_days * day_month;
          
          } else {

            loop_no_of_days = no_of_days;
          }
          time_before_days = new Date(current_date_new.getTime() + (-loop_no_of_days*24*60*60*1000));  
          current_date_new_s = new Date(current_date_new.getTime() + (+7*60*1000));
      }
      var date_diff = current_date_new_s-time_before_days;
      var day_date_diff = Math.round(date_diff/(1000 * 60 * 60 * 24));
      var no_of_days_new;
      if(no_of_days=='custom'){
        no_of_days_new = day_date_diff;
      }else{
        no_of_days_new = no_of_days;
      }

      var day_month_query;
      var date_arr = [];
      var date_format_new;
      if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
          
          day_month_query = { $substr: [ "$created", 0, 7 ] };
          date_format_new  = "yyyy-mm";
          for( var i=0; i < no_of_days_new; i++ ) {

            var date_i =  i*day_month;
            var created_date_on = new Date(current_date.getTime() + (-date_i*24*60*60*1000));
            created_date_on = created_date_on.toISOString();
            created_date_on = created_date_on.split('.')[0].replace('T', ' ');
            created_date_on = date_format(created_date_on,date_format_new );
            date_arr[i] = created_date_on;
          
          }

      } else {
          
          day_month_query = { $substr: [ "$created", 0, 10 ] };
          date_format_new = "mm/dd/yyyy";
          for( var i=0; i < no_of_days_new; i++ ) {

            var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
            created_date_on = created_date_on.toISOString();
            created_date_on = created_date_on.split('.')[0].replace('T', ' ');
            created_date_on = date_format(created_date_on, date_format_new);
            date_arr[i] = created_date_on;
          
          }
      }
      var date_arr = date_arr.sort();
      var registered_user_ar = [];
      var registered_user_date_ar = [];
      var final_user_register_arr = [];

      connection.app_event_users.aggregate(  {$match: {app_id:app_id,'status':'active','created':{$gte: time_before_days, $lt:current_date_new_s}}}, {$group : {_id : day_month_query, total : { $sum : 1 }}},{ "$sort": { "_id" : 1 } },function(err,registered_user){

            for( var k=0;k<registered_user.length;k++ )
            {
              var created_date_on = lib._time_zone_data( time_zone, registered_user[k]['_id'] );
              var created_date_new = date_format(created_date_on, date_format_new);
              registered_user_ar[k] = {

                "recent_dt":created_date_new,
                "total":registered_user[k]['total'],
              };
              registered_user_date_ar[k] = created_date_new;
            }

            for( var k=0;k<date_arr.length;k++ )
            {
                var pos = registered_user_date_ar.indexOf(date_arr[k]);
                var recent_dt;
                var total;
                if(registered_user_date_ar.indexOf(date_arr[k])>-1)
                {
                   recent_dt =  registered_user_ar[pos]['recent_dt'];
                   total  = registered_user_ar[pos]['total'];

                } else {

                  recent_dt = date_arr[k];
                  total = 0;
                }
                final_user_register_arr[k] = {"recent_dt":recent_dt,"total":total};
            }

        found_registered_user(final_user_register_arr); 
      
      });
      function found_registered_user(registered_user)
      {
        connection.app_event_users.find({'app_id':app_id,'status':'active','created':{$gte: time_before_days, $lt:current_date_new_s}},function(err,data){

          var last_event_arr = [];
          var event_key = 0;
          function app_event_user_data(event_key)
          {
            if(event_key<data.length)
            {

              connection.user_events.find({'app_event_user_id':new ObjectID(data[event_key]['_id']),'status':'active','recent_status':1},function(err,user_event_data){
                  
                  if( user_event_data.length>0 )
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
                  
              }).sort({ modified : -1 }).limit(1);

              function event_name_function(event_name)
              {
                /*var active_time;
                if(lib.is_not_empty(data[event_key]['modified']))
                {
                  active_time = lib.time_format(data[event_key]['modified']);
                }else{
                  active_time = "";
                }*/
                /*var created_date_on;
                if(lib.is_not_empty(data[event_key]['created']))
                {
                  created_date_on = lib.time_format(data[event_key]['created']);
                  lib._time_zone_data(time_zone,created_date_on)
                
                }else{
                  created_date_on = "";
                }*/
                //console.log(created_date_on);
                last_event_arr[event_key] = {
                  
                  'username':data[event_key]['username'],
                  'created':date_format(lib._time_zone_data(time_zone,data[event_key]['created']),'dd/mm/yyyy hh:MM:ss TT'),
                  'active_time':date_format(lib._time_zone_data(time_zone,data[event_key]['modified']),'dd/mm/yyyy hh:MM:ss TT'),
                  'recent_events':event_name
                };
                event_key++;
                app_event_user_data(event_key);
              }

            } else {
     
                 if(last_event_arr.length>0)
                 {
                  var date_range = lib.start_end_date( date_arr ,day_month_wise );

                  response['authCode'] = apps_success_code;
                  response['authMessage'] = fetch_data;
                  response['params'] = last_event_arr;
                  response['registered_user'] = registered_user;
                  response['date_range'] = date_range;
                  res.json(response);
                
                } else {

                  response['authCode'] = apps_error_code;
                  response['authMessage'] = recent_user_not;
                  response['params'] = recent_user_not;
                  res.json(response);
                }
            }

          }
          
          app_event_user_data(event_key);
        }).sort({ created : -1 }).limit(limit);
      }
    });
  }

});
router.get('/report_events/:app_id', function(req, res, next) {

  var response = {};
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
     
      time_zone_query(app_id,function( time_zone ) {
        
        var current_date_new = new Date();
        var current_date_new = new Date(current_date_new.getTime());

        var current_date = lib._time_zone_data( time_zone,current_date_new );
        current_date = new Date(current_date);

        var event_data_query = [
          {
            $project:
            {
              //find value for created date
              '_id':1,'event_name':1,'event_slug':1,'total_count':1,'type':1,'last_triggred':1,'status':1,'app_id':1,'created':1,'modified':1,'random_event_id':1,'insensitive':1,
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
        var event_data_query_count = {'app_id':new ObjectID(app_id),'status':'active'};
       connection.events.count(event_data_query_count,function(err,event_count){
            count_event_data(event_count);  
       })
       function count_event_data(event_count)
       {
          var time_before_days = new Date(current_date.getTime() + (-7*24*60*60*1000));
          var current_date_new_s = new Date(current_date.getTime() + (+7*60*1000));
          
          connection.events.find({'app_id':new ObjectID(app_id),'status':'active','last_triggred':{$gte: time_before_days, $lt:current_date_new_s}},function(err,top_event_data_create){
              
              var top_event_arr = [];
              for(var h= 0 ;h<top_event_data_create.length;h++)
              {
                  top_event_arr[h] = top_event_data_create[h]['event_name'];
              }
             
            connection.events.aggregate(event_data_query,function(err,data){
                  event_key = 0;
                  var event_data_arr = [];
                  function event_data_fetch_all(event_key)
                  {
                      
                        if(event_key<data.length)
                        { 
                            connection.user_tracks.count({'event_id':new ObjectID(data[event_key]['_id']),'status':'active'},function(err,track_data_count){
                                  count_track_data_function(track_data_count);
                             });
                            function count_track_data_function(track_count)
                            {
                              
                                var pos = top_event_arr.indexOf(data[event_key]['event_name']);
                                var checked = false;
                                if(pos!=-1)
                                {
                                  checked = true;
                                }
                                /*var created_date_on = data[event_key]['last_triggred'];
                                created_date_on = created_date_on.toISOString();
                                created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                                var last_triggred = date_format(created_date_on, "mm/dd/yyyy HH:MM");*/
                                var total_count;

                                if(data[event_key]['total_count']==0)
                                {
                                  total_count = '-';
                                }else{
                                  total_count = data[event_key]['total_count'];
                                }
                                  
                                event_data_arr[event_key] = {
                                  'event_id':data[event_key]['_id'],
                                  'event_slug':data[event_key]['event_slug'],
                                  'event_name':data[event_key]['event_name'],
                                  'random_event_id':data[event_key]['random_event_id'],
                                  'total_count':total_count,
                                  'type':data[event_key]['type'],
                                  'last_triggred_on':lib._time_zone_data( time_zone,data[event_key]['last_triggred']),
                                  'track_count':track_count,
                                  'checked':checked
                                };
                                  
                                event_key++;
                                event_data_fetch_all(event_key);
                                
                          }
                            //});
                        } else {

                              if(event_data_arr.length>0)
                              {
                                response['authCode'] = apps_success_code;
                                response['authMessage'] = fetch_data;
                                response['params'] = event_data_arr;
                                response['total_count'] = event_count;
                                res.json(response);
                              }else{

                                response['authCode'] = apps_error_code;
                                response['authMessage'] = event_data_not_exist;
                                response['params'] = event_data_not_exist;
                                res.json(response);
                              }
                        }
                      
                  }
                  event_data_fetch_all(event_key);
            })

          }).sort({ 'total_count' : -1 }).limit(5);
       }

    });
  }else{
            response['authCode'] = apps_error_code;
            response['authMessage'] = empty_sort_order_by;
            response['params'] = empty_sort_order_by;
            res.json(response);
      }
});
module.exports = router;