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
var reqe = require('request');
var moment = require('moment');
var moment = require("moment-timezone");
var schedule = require('node-schedule');
moment.tz.setDefault("Asia/Kolkata");
var zone = "Asia/Kolkata";
var now = new Date();

var current_date_new = new Date();
var current_date = new Date(current_date_new.getTime());
/*var nodemailer = require( 'nodemailer' );
var transporter = nodemailer.createTransport({

    service: 'Gmail',
    auth: {

        user: 'user1.guts@gmail.com',
        pass: 'wedig@123'
    }
});*/
//var bodyParser = require( 'body-parser' );
//router.use(bodyParser.json());
//var multer          =       require('multer');
//router.use(bodyParser.urlencoded({"extended" : true}));

/* GET content of marters */
router.post('/user_activity_logs', function(req, res, next) {
  
 var data = {};
 var operator_data_set = req.body.operator_data_set;

 var response = {};
 if( lib.is_not_empty(operator_data_set) ) {
  
    usas_data_save_logs( operator_data_set );

    response['authCode'] = apps_success_code;
    response['authMessage'] = "Data saved successfully.";
    response['params'] = "Data saved successfully.";
    res.json(response);
  
  } else {

      response['authCode'] = apps_error_code;
      response['authMessage'] = "Empty logs data.";
      response['params'] = "Empty logs data.";
      res.json(response);
  }

});

router.post('/search/save_search_logs', function(req, res, next) {

 var data = {};
 var operator_data_set = req.body.operator_data_set;

 var response = {};


 if( lib.is_not_empty(operator_data_set) ) {

    var logs_data_arr = {};
    
    if ( lib.is_not_empty(operator_data_set['user_id']) ) {

        logs_data_arr['user_id'] = new ObjectID(operator_data_set['user_id']);
    }

    if ( lib.is_not_empty(operator_data_set['app_id']) ) {

        logs_data_arr['app_id'] = new ObjectID(operator_data_set['app_id']);
    }

    if ( lib.is_not_empty(operator_data_set['flag']) ) {

        logs_data_arr['flag'] = operator_data_set['flag'];
    }

    if ( lib.is_not_empty(operator_data_set['report_data']['key']) ) {

        logs_data_arr['key'] = operator_data_set['report_data']['key'];
    }



    connection.user_activity_logs.find(logs_data_arr,function( err, data_exists ){
  

      if( !lib.is_not_empty(data_exists) ) {
        
        usas_data_save_logs( operator_data_set );

        response['authCode'] = apps_success_code;
        response['authMessage'] = "Data saved successfully.";
        response['params'] = "Data saved successfully.";
        res.json(response);
      
      } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = "You've already saved this search configuration.";
        response['params'] = "You've already saved this search configuration.";
        res.json(response);

      }

    });
  
  } else {

      response['authCode'] = apps_error_code;
      response['authMessage'] = "Empty logs data.";
      response['params'] = "Empty logs data.";
      res.json(response);
  }

});

router.post('/pdf', function(req, res, next) {

  var fs = require('fs');
  var PDFDocument = require('pdfkit');

  doc = new PDFDocument;    
  doc.pipe(fs.createWriteStream('output.pdf'));    
  doc.font('fonts/PalatinoBold.ttf').fontSize(25).text(100, 100);
  res.send("hello anupam");

});
function usas_data_save_logs( data ) {
      
      var current_date_new = new Date();
      var current_date = new Date(current_date_new.getTime() + (+330*60*1000));
      
      var usas_data_arr = {};
      if( lib.is_not_empty(data['user_id']) ){
        
        usas_data_arr['user_id'] = new ObjectID(data['user_id']);
      
      } else {

        usas_data_arr['user_id'] = "";

      }

      if( lib.is_not_empty(data['app_id']) ) {
        
        usas_data_arr['app_id'] = new ObjectID(data['app_id']);
      
      } else {
        
        usas_data_arr['app_id'] = "";
      }
      if( lib.is_not_empty(data['report_data']) ) {

          usas_data_arr['key'] = data['report_data']['key'];
      
      } else {

        usas_data_arr['key'] = "";

      }
      usas_data_arr['flag'] = data['flag'];
      usas_data_arr['data'] = data;
      usas_data_arr['created'] = current_date;
      //res.send(event_data_arr);

      var save_user_activity_logs_data_connection = connection.user_activity_logs(usas_data_arr);
      save_user_activity_logs_data_connection.save( function( err, result ) {});
}

router.post('/add', function(req, res, next) {

    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var app_id = new ObjectID(req.headers.app_id);
    var event_name = req.headers.event_name;
    var event_slug = req.headers.event_slug;
    var type = req.headers.type;
    var random_event_id = req.headers.random_event_id;
    
    var event_data_arr = {};
    if(lib.is_not_empty(app_id) && lib.is_not_empty(event_name) && lib.is_not_empty(event_slug) && lib.is_not_empty(type)){

       connection.events.find({'event_name':event_name,'app_id':app_id,'status':'active'},function(err,data){
        if(data.length>0)
        {
            response['authCode'] = apps_error_code;
            response['authMessage'] = event_name_exist;
            response['params'] = event_name_exist;
            res.json(response);

        } else {

            var default_date = current_date;
            event_data_arr['event_slug'] = event_slug;
            event_data_arr['event_name'] = event_name;
            event_data_arr['status'] = 'active';
            event_data_arr['total_count'] = 0;
            event_data_arr['type'] = type;
            event_data_arr['random_event_id'] = random_event_id;
            event_data_arr['app_id'] = app_id;
            event_data_arr['last_triggred'] = default_date;
            event_data_arr['created'] = current_date;
            event_data_arr['modified'] = current_date;
            //res.send(event_data_arr);
            var save_events_data_connection = connection.events(event_data_arr);
           save_events_data_connection.save( function( err, result ) {
            
                  response['authCode'] = apps_success_code;
                  response['authMessage'] = event_success;
                  response['params'] = event_success;
                 // console.log(response);
                  res.json(response);

              });

        }

       });

    } else {

        if(!lib.is_not_empty(event_name))
        {
           response['authCode'] = apps_error_code;
           response['authMessage'] = empty_event_name;
           response['params'] = empty_event_name;
           res.json(response);

         } else {

           response['authCode'] = apps_error_code;
           response['authMessage'] = apps_required;
           response['params'] = apps_required;
           res.json(response);
         }
    }

});

router.get('/:app_id', function(req, res, next) {

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
        connection.events.aggregate(event_data_query,function(err,data){

              event_key = 0;
              var event_data_arr = [];
              function event_data_fetch_all(event_key)
              {
               
                if(event_key<data.length)
                {
                    var created_date_on = data[event_key]['last_triggred'];
                    created_date_on = lib._time_zone_data( time_zone,created_date_on );
                    /*created_date_on = created_date_on.toISOString();
                    created_date_on = created_date_on.split('.')[0].replace('T', ' ');*/
                    var last_triggred = date_format(created_date_on, "mm/dd/yyyy HH:MM");
                    /*var last_triggred_date;
                    if(created_date_on!="1111-11-10 23:41:00"){
                      last_triggred_date = last_triggred;
                    }else{
                      last_triggred_date = "-";
                    }*/
                    var total_count;
                    if(data[event_key]['total_count']==0)
                    {
                      total_count = '-';

                    } else {

                      total_count = data[event_key]['total_count'];
                    }
                    event_data_arr[event_key] = {

                      'event_id':data[event_key]['_id'],
                      'event_slug':data[event_key]['event_slug'],
                      'event_name':data[event_key]['event_name'],
                      'random_event_id':data[event_key]['random_event_id'],
                      'total_count':total_count,
                      'type':data[event_key]['type'],
                      'last_triggred_on':last_triggred
                    };

                    event_key++;
                    event_data_fetch_all(event_key);

                } else {

                  if(event_data_arr.length>0)
                  {
                    response['authCode'] = apps_success_code;
                    response['authMessage'] = fetch_data;
                    response['params'] = event_data_arr;
                    response['total_count'] = event_count;
                    res.json(response);

                  } else {

                    response['authCode'] = apps_error_code;
                    response['authMessage'] = event_data_not_exist;
                    response['params'] = event_data_not_exist;
                    res.json(response);
                  }
                }
              }
              event_data_fetch_all(event_key);
        })
       }

   });

  } else {
            response['authCode'] = apps_error_code;
            response['authMessage'] = empty_sort_order_by;
            response['params'] = empty_sort_order_by;
            res.json(response);
      }
  //res.send("hello anupam");
});
router.get('/id/:id', function(req, res, next) {

  var response = {};
  var id = req.params.id;
  connection.events.find({'_id':new ObjectID(id),'status':'active'},function(err,data){

      if(data.length>0)
      {

        response['authCode'] = apps_success_code;
        response['authMessage'] = fetch_data;
        response['params'] = data;
        res.json(response);

      } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = event_data_not_exist;
        response['params'] = event_data_not_exist;
        res.json(response);
      }

  });

  //res.send("hello anupam");
});
router.get('/fields/:id', function(req, res, next) {

  var response = {};
  var id = req.params.id;
  connection.events.find({'_id':new ObjectID(id),'status':'active'},function(err,data){

      if(data.length>0)
      {
        var fields_arr = {};
        var field_new;
        //for( var i=0;i<data[0].fields.length;i++ ) {

          //field_new = data[0].fields[i];
          connection.user_tracks.find({'event_id':new ObjectID(id)},function( err , data_tracks ) {

            var key_arr = []; 
            if( lib.is_not_empty(data_tracks) ){

               
               var event_data = data_tracks[0].event_data[0];
               
               if( lib.is_not_empty(event_data) ) {
                
                    var j=0;
                  
                    for(var e_data in event_data) {

                      if( typeof(event_data[e_data])!="object" && e_data!="question") {

                        key_arr[j] = e_data;
                        
                        j++;
                      
                      }
                    }
                  }

              }

              response['authCode'] = apps_success_code;
              response['authMessage'] = fetch_data;
              response['params'] = {"fields":key_arr};
              res.json(response);
          
          }).sort({"_id":-1}).limit(1);
        
        //}

       

      } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = event_data_not_exist;
        response['params'] = event_data_not_exist;
        res.json(response);
      }

  });

  //res.send("hello anupam");
});

router.put('/:event_id', function(req, res, next) {
    
    response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var event_id = new ObjectID(req.params.event_id);
    var app_id = new ObjectID(req.headers.app_id);
    var event_name = req.headers.event_name.trim();
    var event_slug = req.headers.event_slug;
    var type = req.headers.type;
    var fields_str = req.headers.fields_str;
    var event_data_arr = {};
    if(lib.is_not_empty(event_name) && lib.is_not_empty(type) && lib.is_not_empty(event_slug) && lib.is_not_empty(app_id)){

       connection.events.find({'_id':{$ne:event_id},'app_id':app_id,'event_name':event_name,'status':'active'},function(err,data){
        if(data.length>0)
        {
            response['authCode'] = apps_error_code;
            response['authMessage'] = event_name_exist;
            response['params'] = event_name_exist;
            res.json(response);

        }else{
            
            connection.events.find({'_id':event_id,'status':'active'},function(err,data_count){

              if(data_count.length>0)
              {
                //var total_count = data_count[0]['total_count']+1;
              
                event_data_arr['event_slug'] = event_slug;
                event_data_arr['event_name'] = event_name;
                event_data_arr['status'] = 'active';
                if(lib.is_not_empty(fields_str))
                {
                  var fields_arr = fields_str.split(',');
                  var fields_data_arr = [];
                  for(var i=0;i<fields_arr.length;i++)
                  {
                    fields_data_arr[i] = fields_arr[i];
                  }
                  event_data_arr['fields'] = fields_data_arr;
                }
                //event_data_arr['type'] = type;
               // event_data_arr['total_count'] = total_count;
                //event_data_arr['last_triggred'] = current_date;
                event_data_arr['modified'] = current_date;
                //res.send(event_data_arr);
                connection.events.update( { '_id' : new ObjectID(event_id) }, { '$set' : event_data_arr }, { upsert: true }, function( err_update, result_update ) {
                            
                      response['authCode'] = apps_success_code;
                      response['authMessage'] = event_data_updated;
                      response['params'] = event_data_updated;
                      res.json(response);
                });
              }else{
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = event_id_not_found;
                    response['params'] = event_id_not_found;
                    res.json(response);
              }
          });

        }

       });
    }else{
        if(!lib.is_not_empty(event_name))
        {
           response['authCode'] = apps_error_code;
           response['authMessage'] = empty_event_name;
           response['params'] = empty_event_name;
           res.json(response);
        
        }else{

         response['authCode'] = apps_error_code;
         response['authMessage'] = apps_required;
         response['params'] = apps_required;
         res.json(response);
       }
    }

});
/*router.delete('/:id', function(req, res, next) {

    response = {};
    event_id = req.params.id;
    var event_data_arr = {};
    event_data_arr['status'] = 'inactive';
    event_data_arr['modified'] = current_date;
    connection.events.find({'_id':new ObjectID(event_id),'status':'active'},function(err,data){
      if(data.length>0)
      {
        connection.events.update( { '_id' : new ObjectID(event_id) }, { '$set' : event_data_arr }, { upsert: true }, function( err_update, result_update ) {
                    
            response['authCode'] = apps_success_code;
            response['authMessage'] = Data_delete;
            response['params'] = Data_delete;
            res.json(response);
        });
      }else{
          response['authCode'] = apps_error_code;
          response['authMessage'] = event_data_not_exist;
          response['params'] = event_data_not_exist;
          res.json(response);
      }
    });
   
 

});*/
router.delete('/', function(req, res, next) {

    response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    event_id_str = req.headers.event_id_str;
    var event_data_arr = {};
    var event_user_data_aar = {};
    if(lib.is_not_empty(event_id_str))
    {
      var event_id_arr = event_id_str.split(',');
      for(i=0;i<event_id_arr.length>0;i++)
      {
        event_data_arr['status'] = 'inactive';
        event_data_arr['last_triggred'] = current_date;
        event_data_arr['modified'] = current_date;
        //set array for user_events collection
        event_user_data_aar['status']='inactive';
        event_user_data_aar['modified']=current_date;
        connection.user_events.find({'event_id':new ObjectID(event_id_arr[i]),'status':'active','recent_status':1},function(err,fetch_data_event){
          //Find recent events when user delete it
          var recent_event_arr = {};
          if(fetch_data_event.length>0)
          {
            connection.user_events.find({'app_event_user_id':new ObjectID(fetch_data_event[0]['app_event_user_id']),'status':'active','recent_status':0},function(err,fetch_recent_event){
              recent_event_arr['recent_status'] = 1;
               connection.user_events.update( {'_id' : new ObjectID(fetch_recent_event[0]['_id']) }, { '$set' : recent_event_arr }, { multi: true }, function( err_update, result_update ) {
                });
            
            }).sort({created:-1});
          }
        })
       //End of the code here
       connection.events.update( { '_id' : new ObjectID(event_id_arr[i]) }, { '$set' : event_data_arr }, { upsert: true }, function( err_update, result_update ) {
          });
        connection.user_events.update( {'event_id' : new ObjectID(event_id_arr[i]) }, { '$set' : event_user_data_aar }, { multi: true }, function( err_update, result_update ) {
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
router.get('/integration/:event_id', function(req, res, next) {

  var response = {};
  var event_id = req.params.event_id;
  connection.integrations.find({'event_id':new ObjectID(event_id),'status':'active'},function(err,data){
    var integrationsArr = []; 
    if(data.length>0)
    {
      for(var i=0;i<data.length;i++){
          integrationsArr[i] = {
                'integration_id':data[i]['_id'],
                'integration_name':data[i]['integration_name']
              }
      }

      response['authCode'] = apps_success_code;
      response['authMessage'] = fetch_data;
      response['params'] = integrationsArr;
      res.json(response);

    }else{
      response['authCode'] = apps_error_code;
      response['authMessage'] = event_data_not_exist;
      response['params'] = event_data_not_exist;
      res.json(response);
    }

  });

  //res.send("hello anupam");
});
router.get('/integration/:event_id/:integration_id', function(req, res, next) {

  var response = {};
  var app_id = req.params.app_id;
  var integration_id = req.params.integration_id;
  connection.integrations.find({'_id':new ObjectID(integration_id),'status':'active'},function(err,data){

      if(data.length>0)
      {

        response['authCode'] = apps_success_code;
        response['authMessage'] = fetch_data;
        response['params'] = data;
        res.json(response);

      }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = event_data_not_exist;
        response['params'] = event_data_not_exist;
        res.json(response);
      }

  });

  //res.send("hello anupam");
});
/*router.get('/track/:app_id', function(req, res, next) {

    var response = {};
    var item_per_page = parseInt(req.headers.item_per_page);
    var app_id = req.params.app_id;
    var offset = (req.headers.offset-1)*item_per_page;
    var event_id  = req.headers.event_id;
    var no_of_days = req.headers.no_of_days;
    var start_date = req.headers.start_date;
    var end_date = req.headers.end_date;
    var track_data_arr = [];
    var track_key = 0;
    var track__data_key = 0;
    var keyss = [];
    //send data according to time date
    var time_before_days;
    var current_date_time;
    if(no_of_days==7)
    {
      time_before_days = new Date(current_date.getTime() + (-7*24*60*60*1000));
      current_date_time = current_date;
    
    }else if(no_of_days==30){

      time_before_days = new Date(current_date.getTime() + (-30*24*60*60*1000));
      current_date_time = current_date;
    
    }else{
        var start_date = start_date.split('.')[0].replace(' ', 'T');
        var end_date  = end_date.split('.')[0].replace(' ','T');
        time_before_days = start_date;
        current_date_time = end_date;

    }

        if(lib.is_not_empty(no_of_days))
        {
          var event_data_query = {'status':'active','event_id':new ObjectID(event_id),'app_id':new ObjectID(app_id),'last_time':{$gte: time_before_days, $lt:current_date_time}};
        }else{
          var event_data_query = {'status':'active','event_id':new ObjectID(event_id),'app_id':new ObjectID(app_id)};
        }
        
        connection.user_tracks.count(event_data_query ,function(err,data_count){
          total_track_record_count(data_count);
        });
        function total_track_record_count(data_count)
        { 
          connection.user_tracks.find(event_data_query ,function(err,data){//console.log(data);
           connection.events.find({'_id':new ObjectID(event_id),'status':'active'},function(err,unique_data_arr){
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
                          keyss.push(item_key);
                       
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

                      'object_label' : data[track_key]['object_label'],
                      'event_name':event_name,
                      'current_link':data[track_key]['current_link'],
                      'browser' : data[track_key]['browser'],
                      'os' :data[track_key]['os'],
                      'app_id':data[track_key]['app_id'],
                      'screen_size': data[track_key]['screen_size'],
                      'history_count': data[track_key]['history_count'],
                      'status' :data[track_key]['status'],
                      'modified' :data[track_key]['modified'],
                      'created' :data[track_key]['created'],
                      'last_time': data[track_key]['last_time'],
                      'config_data' : data[track_key]['config_data'],
                      'page_title' : data[track_key]['page_title'],
                      'session_id' : data[track_key]['session_id'],
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

          }).skip(offset).limit(item_per_page).sort({'created':-1});
        }

});*/
router.get('/track/search/:app_id', function(req, res, next) {
  
  //start the parameters here
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());

  var response = {};
  if(lib.is_not_empty(req.headers.offset) && lib.is_not_empty(req.headers.event_id))
  {
    var app_id = new ObjectID(req.params.app_id);
    var event_id = new ObjectID(req.headers.event_id);
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
    if(lib.is_not_empty(app_id) && lib.is_not_empty(event_id) && lib.is_not_empty(search_string) && lib.is_not_empty(select_arrays))
    {
        //Search data according to date filters
          if(lib.is_not_empty(no_of_days))
          {
            if(no_of_days=='custom'){

                time_before_days = new Date(start_date.slice(1, -1));  
                current_date_time = new Date(end_date.slice(1, -1));

            }else{
                
                time_before_days = new Date(current_date.getTime() + (-no_of_days*24*60*60*1000));  
                current_date_time = new Date(current_date.getTime() + (+7*60*1000));
            }
            var event_data_query13 = [{'status':'active'},{'event_id':event_id},{app_id:app_id,'last_time':{$gte:time_before_days, $lte:current_date_time}}];

          }else{

            var event_data_query13 = [{app_id:app_id},{'status':'active'},{'event_id':event_id}];
          }
          //End of the code here
            var search_string_str  = {'$regex':search_string,$options: '-i'};
            for(var arr = 0;arr<select_arrays.length;arr++)
            {
              var user_event_arr = {[select_arrays[arr]]:search_string_str};
              like_query_var[arr] = {'event_data': {"$elemMatch": user_event_arr}};
            }

           var event_data_query =   [
           {$project:{
            '_id':1,'event_id':1,'event_slug':1,'total_count':1,'object_label':1,'current_link':1,'browser':1,'os':1,'random_app_id':1,'screen_size':1,'history_count':1,'status':1,'type':1,'last_triggred':1,'status':1,'app_id':1,'created':1,'modified':1,'random_event_id':1,'page_title':1,'last_time':1,'config_data':1,'event_data':1,'insensitive':1,insensitive: { "$toUpper": "$browser"
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
      
    }else{
          response['authCode'] = apps_error_code;
          response['authMessage'] = like_all_fields;
          response['params'] = like_all_fields;
          res.json(response);
    }
  }else{
        
      response['authCode'] = apps_error_code;
      response['authMessage'] = event_offset;
      response['params'] = event_offset;
      res.json(response);
  }

});
router.get('/track/data/id/:track_id', function(req, res, next) {

    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var track_id = req.params.track_id;
    var event_id = req.headers.event_id;
    var track_data_arr = [];
    var track_key = 0;
    var track__data_key = 0;
    var keyss = [];
    //send data according to time date

    if(lib.is_not_empty(track_id) && lib.is_not_empty(event_id))
    {
        var event_data_query = {'status':'active','_id':new ObjectID(track_id)};
        
        
        connection.user_tracks.count(event_data_query ,function(err,data_count){
          total_track_record_count(data_count);
        });
        function total_track_record_count(data_count)
        { 
          connection.user_tracks.find(event_data_query ,function(err,data){
           connection.events.find({'_id':new ObjectID(event_id),'status':'active'},function(err,unique_data_arr){
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
                          keyss.push(item_key);
                       
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
                          //console.log(lib.recursivelyIterateProperties(data[track_key]['event_data'][0][unique_keyss_arr[p]]));
                          if(typeof(data[track_key]['event_data'][0][unique_keyss_arr[p]])=="object")
                          { 
                            var object_key_data = data[track_key]['event_data'][0][unique_keyss_arr[p]];
                            for (var key_ob in object_key_data) {
                              tempData[lib.ucwords(lib.humanize(key_ob))] = object_key_data[key_ob];
                              //console.log(key_ob);
                            }
                            event_user_track_data = tempData;
                            //console.log(tempData);
                          }else{
                            event_user_track_data = data[track_key]['event_data'][0][unique_keyss_arr[p]];
                          }

                        }
                        var user_key = lib.ucwords(lib.humanize(unique_keyss_arr[p]));
                        unique_data_object[[user_key]] = event_user_track_data;
                        //console.log(lib.ucwords(lib.humanize("hello anupam")));

                        //uniq_new_arr[p] = unique_data_object;
                      }
                      uniq_new_arr[0] = unique_data_object;
                      //Humanize the data off all keys
                      console.log(event_names);
                      var event_names = lib.ucwords(lib.humanize("event_name"));
                      var object_label = lib.ucwords(lib.humanize("object_label"));
                      var current_link = lib.ucwords(lib.humanize("current_link"));
                      var browser = lib.ucwords(lib.humanize("browser"));
                      var os = lib.ucwords(lib.humanize("os"));
                      var screen_size = lib.ucwords(lib.humanize("screen_size"));
                      var history_count = lib.ucwords(lib.humanize("history_count"));
                      var status = lib.ucwords(lib.humanize("status"));
                      var created = lib.ucwords(lib.humanize("created"));
                      var last_time = lib.ucwords(lib.humanize("last_time"));
                      var config_data = lib.ucwords(lib.humanize("config_data"));
                      var page_title = lib.ucwords(lib.humanize("page_title"));
                      var session_id = lib.ucwords(lib.humanize("session_id"));
                      var event_data = lib.ucwords(lib.humanize("event_data"));
                      var app_id = lib.ucwords(lib.humanize("app_id"));
                      var created_date_last_time;
                      if(lib.is_not_empty(data[track_key]['last_time']))
                      {
                         created_date_last_time = lib.time_format(data[track_key]['last_time']);
                      }else{
                        created_date_last_time = "";
                      }
                      //End of the code here 
                      track_data_arr[track_key]={

                      [object_label]: data[track_key]['object_label'],
                      [event_names]:event_name,
                      [current_link]:data[track_key]['current_link'],
                      [browser] : data[track_key]['browser'],
                      [os] :data[track_key]['os'],
                      [app_id]:data[track_key]['random_app_id'],
                      [screen_size]: data[track_key]['screen_size'],
                      [history_count]: data[track_key]['history_count'],
                      [status] :data[track_key]['status'],
                      //[created] :data[track_key]['created'],
                      [last_time]: created_date_last_time,
                      [config_data] : data[track_key]['config_data'],
                      [page_title] : data[track_key]['page_title'],
                      [session_id] : data[track_key]['session_id'],
                      [event_data] : uniq_new_arr
                    };

                     track_key++;
                      track_user_data(track_key);
                   });

                 
                }else{

                    response['authCode'] = apps_success_code;
                    response['authMessage'] = fetch_data;
                    response['params'] = track_data_arr;
                    res.json(response);
                }
             }

            track_user_data(track_key);
          }

          })
        }
    }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_event_track_id;
        response['params'] = empty_event_track_id;
        res.json(response);
    }

});
router.post('/track', function(req, res, next) {

    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var random_app_id = req.body.random_app_id.trim();
    var random_event_id = req.body.event.trim();
    var object_label = req.body.object_label;
    //var url = req.body.url;
    var browser = req.body.browser;
    var os = req.body.os;
    var screen_size = req.body.screen_size;
    var history_count = req.body.history_count;
    var config_data = req.body.config_data;
    var page_title = req.body.page_title;
    var session_id = req.body.session_id;
    var event_data = req.body.event_data;

    var track_data_arr = {};
    var keyss = [];
    if(lib.is_not_empty(random_app_id)){
            connection.apps.find( {'random_app_id':random_app_id,'status':'active'} ,function(err,random_app_data){

              if(random_app_data.length>0)
              {
                orignal_app_id_func(random_app_data[0]['_id']);
              }else{
                orignal_app_id_func("578e06926c2a763c10670bc4");
              }
            });
            function orignal_app_id_func(app_id)
            {
              connection.events.find( {'random_event_id':random_event_id,'status':'active'} ,function(err,random_event_data){
                if(random_event_data.length>0)
                {
                  //Save track format in event table
                    
                    for (var item in random_event_data[0]['fields']) {
                        keyss.push(random_event_data[0]['fields'][item]);
                    }
                    for (var item in event_data) {
                        if(item!='type')
                        {
                          keyss.push(item);
                        }
                    }
                    function sort_unique(arr) {
                      return arr.filter(function(el,i,a) {
                          return (i==a.indexOf(el));
                      });
                    }
                    var unique_keys = sort_unique(keyss);
                    //var unique_keys = keyss;
                    //console.log(unique_keys);
                    //console.log(unique_keys);
                  //End of the code here

                  orignal_event_id_func(new ObjectID(random_event_data[0]['_id']),new ObjectID(app_id),unique_keys,random_event_data[0].event_name);
                }else{
                  orignal_event_id_func("578e06926c2a763c10670bc4","578e06926c2a763c10670bc4",unique_keys,'Deafult');
                }
              });
            }
            function orignal_event_id_func(event_id,app_id,unique_keys,event_name)
            {
              connection.monitors.find({'random_event_id':random_event_id,'status':'active'},function(err,monitors_exist){
                //Save tracking data for monitoring
                  var moniotr_id_str = ""; 
                  if(monitors_exist.length>0)
                  {
                    for(var i=0;i<monitors_exist.length;i++)
                    {
                      var operator_data_set = monitors_exist[i]['operator_data_set'];
                      var monitor_result = lib.moitor_track_data(operator_data_set,event_data);
                      if(monitor_result==true)
                      {
                        moniotr_id_str+= monitors_exist[i]['_id']+',';
                        //Sending email to all monitor users
                          var email_address;
                          if(lib.is_not_empty(monitors_exist[i].email_address))
                          {
                            email_address = monitors_exist[i].email_address;
                          }else{
                            email_address = "";
                          }
                          function send_notification_mail(){

                           var record = '<table width="100%" border="0" cellspacing="1" cellpadding="8">';
                           record+='<tr><th colspan="3" style="background:#e31a4c; font-size:11px; color:#ffffff; text-align:center"><strong>'+monitors_exist[i]['title']+'</strong></th></tr>';
                           record+='<tr><th colspan="3" style="background:#eeeeee; font-size:11px; color:#414042; text-align:left">User Preferences</th></tr>';
                           record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('app_id'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+random_app_id+'</th></tr>';
                           record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('event_name'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+event_name+'</th></tr>';
                           for (var event_data_value in event_data) {

                              if(event_data_value!='type')
                              {
                                  if(typeof(event_data[event_data_value])=='string' || typeof(event_data[event_data_value])=='number')
                                  {
                                    record +='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize(event_data_value))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+event_data[event_data_value]+'</th></tr>';
                                  }else{
                                      var event_data_str='';
                                      for (var event_data_key in event_data[event_data_value]) {
                                        event_data_str+=event_data[event_data_value][event_data_key]+',';
                                      }
                                      event_data_str = event_data_str.slice(0, -1);
                                    record +='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize(event_data_value))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+event_data_str+'</td></tr>';
                                 }
                              }
                          } 
                          var  object_label_new = '-';
                          if(object_label!=undefined)
                          {
                            object_label_new = object_label;
                          }
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('object_label'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+object_label_new+'</td></tr>';
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('browser'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+browser+'</td></tr>';
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('os'))+'</td><td colspan="3" style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+os+'</td></tr>';
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('screen_size'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+screen_size+'</td></tr>';
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('history_count'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+history_count+'</td></tr>';
                          record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+lib.ucwords(lib.humanize('page_title'))+'</td><td style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+page_title+'</td></tr>';
                          record+'</table>';
                          record+'<table width="100%" border="0" cellspacing="1" cellpadding="8">';
                          record+='<tr><th colspan="3" style="background:#eeeeee; font-size:11px; color:#414042; text-align:left">Monitoring Preferences</th></tr>';
                          for(var operator_data in operator_data_set){
                            record+='<tr><td style="font-size:12px; color:#414042; font-weight:bold; border-bottom:1px solid #eeeeee;">'+operator_data_set[operator_data].user_detail+'</td><td style="font-size:12px; color:#414042;text-align:center;border-bottom:1px solid #eeeeee;">'+operator_data_set[operator_data].operator+'</td><td  style="font-size:12px; color:#414042; border-bottom:1px solid #eeeeee;">'+operator_data_set[operator_data].value+'</td></tr>';
                          }
                          record += '</table>';
                            var mailOptions = {
                              
                              to:email_address,
                                subject: 'Monitoring Notifications ( '+monitors_exist[i]['title']+' )',
                              html:  '<html><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="#E31A4C" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:0; width:100%;"><img src="'+image_logo_url+'" alt="Logo" style="outline:none; vertical-align: middle;width:90px;" /> </a></td></tr><tr><td style="padding:10px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042;" colspan="2"></td></tr><tr><td style="font-size:15px; color:#414042; font-weight:bold;" colspan="2">Thank you for using Monitoring Services from Analytics.</td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">We have sent for you the Notification tracking data that you requested from monitor (<strong>'+monitors_exist[i]['title']+'</strong>).If you want to see your <strong>tracking format</strong>, please see the section below.</td></tr><tr><td style="" colspan="2">'+record+'</td></tr><tr><td style="height:10px;" colspan="2"></td></tr><tr><td style="margin-bottom:5px;" colspan="2"><div style="font-size:12px; color:#414042; display:block; margin:0px 0 5px; font-weight:bold;">Thanks</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">Analytics Team</p></td></tr></table></td></tr><tr><td align="center" height="25px" bgcolor="#E31A4C" style="border-radius:0 0 5px 5px; font-size:12px; color:#ffffff; display:block; margin:0px; padding:10px 0 0; font-weight:normal; text-align:center;"> © <a href="#" style="color:#ffffff; margin-left:0; display:inline-block; text-decoration:none;">Analytics </a>. 2016 All Rights Reserved</td></tr></table></body></html>',
                            };                 
                            
                            transporter.sendMail(mailOptions, function(error, info) {          
                            });             
                          }
                          send_notification_mail();
                        //End of the code here for all users
                      }
                      
                    }
                  }
                  //End of the code here of monitoring
                  //Find unique array
                  var moniotr_id_str_trim = moniotr_id_str.slice(0, -1);
                  var monitor_id_arr = moniotr_id_str_trim.split(',');
                  var monitor_uni_arr = lib.arrUnique(monitor_id_arr);
                  //End of the code unique
                  //Convert array to string
                  var monitor_unique_str = monitor_uni_arr.toString();
                  //End the code here
                  track_data_arr['app_id'] = app_id;
                  track_data_arr['event_id'] = event_id;
                  track_data_arr['random_event_id'] = random_event_id;
                  track_data_arr['object_label'] = object_label;
                  //track_data_arr['current_link'] = url;
                  track_data_arr['browser'] = browser;
                  track_data_arr['os'] = os;
                  track_data_arr['random_app_id'] = random_app_id;
                  track_data_arr['screen_size'] = screen_size;
                  track_data_arr['history_count'] = history_count;
                  track_data_arr['status'] = "active";
                  track_data_arr['modified'] = current_date;
                  track_data_arr['created'] = current_date;
                  track_data_arr['last_time'] = current_date;
                  track_data_arr['config_data'] = config_data;
                  track_data_arr['page_title'] = page_title;
                  track_data_arr['session_id'] = session_id;
                  track_data_arr['event_data'] = event_data;
                  track_data_arr['monitor_id_str'] = monitor_unique_str;
              
                  //res.send(track_data_arr);
                  //update event counter
                  var event_data_arr = {};
                  connection.events.find({'_id':event_id,'status':'active'},function(err,data_count){
                    if(data_count.length>0)
                    {
                      var type;
                      if(lib.is_not_empty(event_data) && lib.is_not_empty(event_data.type) && event_data.type.toLowerCase()=="user")
                      {
                        type = 'User';
                      }else{
                        type = 'System';
                      }

                       var total_count = data_count[0]['total_count']+1;
                       event_data_arr['type'] = type;
                       event_data_arr['fields'] = unique_keys;
                       event_data_arr['total_count'] = total_count;
                       event_data_arr['last_triggred'] = current_date;

                       connection.events.update( { '_id' : event_id }, { '$set' : event_data_arr }, { upsert: true }, function( err_update, result_update ) {
                       });
                     }
                  });
                  //end of the code here
                  var user_data_arr = {};
                  //save user entry after tracking
                  if(lib.is_not_empty(event_data) && lib.is_not_empty(event_data.type) && event_data.type.toLowerCase()=='user')
                  { 
                    var user_data_query = {app_id:app_id,'status':'active','username':event_data.username,'first_name':event_data.first_name,'last_name':event_data.last_name,'email_address':event_data.user_email};
                    connection.app_event_users.find(user_data_query ,function(err,result_user_data){//console.log(result_user_data);
                      if(result_user_data.length==0)
                      {
                        //add data in app_user_events for users
                          user_data_arr['username'] = event_data.username;
                          user_data_arr['first_name'] = event_data.first_name;
                          user_data_arr['last_name'] = event_data.last_name;
                          user_data_arr['email_address'] = event_data.user_email;
                          user_data_arr['modified'] = current_date;
                          user_data_arr['status'] = 'active';
                          user_data_arr['created'] = current_date;
                          user_data_arr['app_id'] = app_id;
                          var save_users_data_connection = connection.app_event_users(user_data_arr);
                          save_users_data_connection.save( function( err, result ) {
                            get_app_event_user_id(result._id,event_id);
                          });
                      }else{
                            get_app_event_user_id(result_user_data[0]['_id'],event_id);
                      }
                    });
                    //Add data in user_events table for recent events
                      var app_user_arr = {};
                      var app_user_data_arr = {};
                      function get_app_event_user_id(app_event_user_id,event_id)
                      {
                          
                          app_user_arr['app_event_user_id'] = new ObjectID(app_event_user_id);
                          app_user_arr['event_id'] = event_id;
                          app_user_arr['status'] = 'active';
                          app_user_arr['recent_status'] = 1;
                          app_user_arr['created'] = current_date;
                          app_user_arr['modified'] = current_date;
                          app_user_data_arr['recent_status'] =0;

                          connection.user_events.find({'app_event_user_id':new ObjectID(app_event_user_id),'status':'active'},function(err,user_data_ids){
                              if(user_data_ids.length>0)
                              {
                                //set recent_event 0 for all rest of events of user 
                                connection.user_events.update( { 'app_event_user_id' : new ObjectID(app_event_user_id) }, { '$set' : app_user_data_arr }, { multi: true }, function( err_update, result_update ) {});
                              }
                         });
                         connection.user_events.find({'app_event_user_id':new ObjectID(app_event_user_id),'event_id':event_id,'status':'active'},function(err,user_data_ids){
                                if(user_data_ids.length==0)
                                {
                                  //set value 1 for recent events of user
                                  var save_apps_data_connection = connection.user_events(app_user_arr);
                                   save_apps_data_connection.save( function( err, result ) {});
                                }else{
                                  connection.user_events.update( { '_id' : new ObjectID(user_data_ids[0]['_id']) }, { '$set' : app_user_arr }, { multi: true }, function( err_update, result_update ) {});
                                }
                        });

                      
                      }
                      //End of the code here of recent_events
                  }
                  //End of the code here
                  var save_events_data_connection = connection.user_tracks(track_data_arr);
                  save_events_data_connection.save( function( err, result ) {
                     if(lib.is_not_empty(err))
                     {
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = err;
                            response['params'] = err;
                           // console.log(response);
                            res.json(response);


                     }else{
                            response['authCode'] = apps_success_code;
                            response['authMessage'] = data_save;
                            response['params'] = data_save;
                           // console.log(response);
                            res.json(response);
                          }
                  });
              });
            }
    }else{
              response['authCode'] = apps_error_code;
              response['authMessage'] = empty_random_app_id;
              response['params'] = empty_random_app_id;
             // console.log(response);
              res.json(response);

    }

});
router.get('/track/:app_id', function(req, res, next) {

  var response = {};
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());

  if(lib.is_not_empty(req.headers.offset) && lib.is_not_empty(req.headers.event_id))
  {
      var app_id = req.params.app_id;
      var event_id  = req.headers.event_id;
      var no_of_days = req.headers.no_of_days;
      var start_date = req.headers.start_date;
      var end_date = req.headers.end_date;
      var item_per_page = parseInt(req.headers.item_per_page);
      var offset = (req.headers.offset-1)*item_per_page;
      var skip=parseInt(item_per_page)+parseInt(offset);
      //var sort_by = req.headers.sort_by;
      //var order_by = parseInt(req.headers.order_by);

      var track_data_arr = [];
      var track_key = 0;
      var track__data_key = 0;
      var keyss = [];
      //send data according to time date
      var time_before_days;
      var current_date_time;
      
      if(lib.is_not_empty(no_of_days))
      {
        if( no_of_days=='custom' ) {

            time_before_days = new Date(start_date.slice(1, -1));  
            current_date_time = new Date(end_date.slice(1, -1));

        } else {
            
            time_before_days = new Date(current_date.getTime() + (-no_of_days*24*60*60*1000));  
            current_date_time = new Date(current_date.getTime() + (+7*60*1000));
        }
        var event_data_query13 = [{'status':'active'},{'event_id':new ObjectID(event_id)},{'app_id':new ObjectID(app_id),'last_time':{$gte:time_before_days, $lte:current_date_time}}];

      } else {

        var event_data_query13 = [{'status':'active'},{'event_id':new ObjectID(event_id)},{'app_id':new ObjectID(app_id)}];
      }
     var event_data_query = [
      {
        $project:
        {
          //find value for created date
          '_id':1,'event_id':1,'event_slug':1,'total_count':1,'object_label':1,'current_link':1,'browser':1,'os':1,'random_app_id':1,'screen_size':1,'history_count':1,'status':1,'type':1,'last_triggred':1,'status':1,'app_id':1,'created':1,'modified':1,'random_event_id':1,'page_title':1,'last_time':1,'config_data':1,'event_data':1,'insensitive':1,
            //insensitive: { "$toUpper": "$first_name"}
        }
      },      
      {
        $match:{
          $and:event_data_query13,
        }   
      },
      // { "$sort": {["event_data."+sort_by]:order_by}},
      { $limit : skip},
      {$skip:offset}
      ];
          //count data of all track table
      var event_data_query_count_row =     {$and:event_data_query13 };

      connection.user_tracks.count(event_data_query_count_row ,function(err,data_count){
        /*console.log(data_count);*/
        total_track_record_count(data_count);
      });
      function total_track_record_count(data_count)
      { 
        connection.user_tracks.aggregate(event_data_query ,function(err,data){//console.log(data);

         connection.events.find({'_id':new ObjectID(event_id),'status':'active'},function(err,unique_data_arr){
           
           if(unique_data_arr.length>0)
           {
              var key_uni_event_arr = unique_data_arr[0]['fields'];

              user_keyss_event_arr_function(key_uni_event_arr);

           } else {

              user_keyss_event_arr_function("");
           
           }
         });
         function user_keyss_event_arr_function(key_uni_event_arr)
         {
           function tack_unique_key(track__data_key)
           {
                if(track__data_key<data.length)
                {
                  for ( var item in data[track__data_key]['event_data'] ) {

                        for ( var item_key in data[track__data_key]['event_data'][item] ) {
                          
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
                      if(lib.is_not_empty(data[track_key]['event_data']))
                      {
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
                      }else{
                            event_user_track_data = "-";
                      }
                     
                      unique_data_object[[unique_keyss_arr[p]]] = event_user_track_data;
                      //uniq_new_arr[p] = unique_data_object;

                    }

                    uniq_new_arr[0] = unique_data_object;
                    track_data_arr[track_key]={

                    'object_label' : data[track_key]['object_label'],
                    'event_name':event_name,
                    'current_link':data[track_key]['current_link'],
                    'browser' : data[track_key]['browser'],
                    'os' :data[track_key]['os'],
                    'app_id':data[track_key]['app_id'],
                    'screen_size': data[track_key]['screen_size'],
                    'history_count': data[track_key]['history_count'],
                    'status' :data[track_key]['status'],
                    'modified' :data[track_key]['modified'],
                    'created' :data[track_key]['created'],
                    'last_time': data[track_key]['last_time'],
                    'config_data' : data[track_key]['config_data'],
                    'page_title' : data[track_key]['page_title'],
                    'session_id' : data[track_key]['session_id'],
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
  }else{
        
      response['authCode'] = apps_error_code;
      response['authMessage'] = event_offset;
      response['params'] = event_offset;
      res.json(response);
  }
});

router.get('/monitoring/monitor_logs/:app_id', function(req, res, next) {

    var app_id = new ObjectID(req.params.app_id);
    var no_of_days = req.headers.no_of_days;
    var start_date = req.headers.start_date;
    var end_date = req.headers.end_date;
    var day_month_wise = req.headers.day_month_wise;
    
    var response = {};
    var time_before_days;
    var current_date_new_s;
    time_zone_query(app_id,function( time_zone ) {
      
      var current_date_new = new Date();
      var current_date_new = new Date(current_date_new.getTime());

      var current_date = lib._time_zone_data( time_zone,current_date_new );
      current_date = new Date(current_date);
      //Find month according to time zone
      var year = date_format(current_date, "yyyy");
      var day = date_format(current_date, "dd");
      var day_month = lib.daysInMonth( day,year );
      
      if( no_of_days=='custom' ) {

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
      var date_arr_new = [];
      var date_format_new;
      if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
          
          for( var i=0; i < no_of_days_new; i++ ) {

            var date_i =  i*day_month;
            var created_date_on = new Date(current_date.getTime() + (-date_i*24*60*60*1000));
            created_date_on = created_date_on.toISOString();
            created_date_on = created_date_on.split('.')[0].replace('T', ' ');
            created_date_on = date_format(created_date_on, "yyyy-mm");
            date_arr[i] = created_date_on;

            //new array for form date and to date
            var created_date_on_new = new Date(current_date_new.getTime() + (-date_i*24*60*60*1000));
            created_date_on_new = created_date_on_new.toISOString();
            created_date_on_new = created_date_on_new.split('.')[0].replace('T', ' ');
            created_date_on_new = date_format(created_date_on_new, "yyyy-mm");
            date_arr_new[i] = created_date_on_new;
          
          }

      } else {
          
          for( var i=0; i < no_of_days_new; i++ ) {

            var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
            created_date_on = created_date_on.toISOString();
            created_date_on = created_date_on.split('.')[0].replace('T', ' ');
            created_date_on = date_format(created_date_on, "yyyy-mm-dd");
            date_arr[i] = created_date_on;

            //new array for form date and to date
            var created_date_on_new = new Date(current_date_new.getTime() + (-i*24*60*60*1000));
            created_date_on_new = created_date_on_new.toISOString();
            created_date_on_new = created_date_on_new.split('.')[0].replace('T', ' ');
            created_date_on_new = date_format(created_date_on_new, "yyyy-mm-dd");
            date_arr_new[i] = created_date_on_new;
            
          }
      }

      var date_arr = date_arr.sort();
      var date_arr_new = date_arr_new.sort();
      var selected_dates = [];
      var selected_dates_new = [];
      
      for( var j = 0; j < date_arr.length; j++ ) {

          selected_dates[j] = date_arr[j];
      }

      for( var j = 0; j < date_arr_new.length; j++ ) {

          selected_dates_new[j] = date_arr_new[j];
      }
   
      var monitor_logs_id_arr_in = [];

      /*connection.monitoring_logs.find({'app_id':app_id,'status':{$ne:'Success'},'created':{$gte: time_before_days, $lt:current_date_new_s}},function(err,monitoring_data_create){*/


         connection.monitoring.find({ "app_id" :app_id, 'status' : 'active','service_status':'1'}, function( err_result_monitoring, result_monitoring ) {

            if( result_monitoring.length>0 ) {

                var response_final = {};
                var date_results = [];
                var key = 0;
                var final_results = {};
                
                function monitoring_logs( key ) {

                    if( key < result_monitoring.length ) {

                       /* connection.monitoring.find({ "_id" : new ObjectID( result_monitoring[key]['_id']), 'status' : 'active' }, function( err_mon_name, result_mon_name ) {*/

                         // console.log(result_monitoring);
                            //if( result_monitoring.length > 0 ) {
                                 
                                var key_date = 0; var date_length = Object.keys(selected_dates).length;
                                var date_wise_result = {};
                                //console.log(date_length); 
                                function date_wise_logs( key_date ) {

                                    var from_date= new Date(selected_dates_new[key_date]+" 00:00:00.000Z");
                                    var to_date;
                                    if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
                                        
                                        to_date =  moment(selected_dates_new[key_date]).add(1, 'month').format("YYYY-MM-DD");
                                        to_date = new Date(to_date);                                    
                                    
                                    } else {

                                       to_date= new Date(selected_dates_new[key_date]+" 23:59:59.999Z");
                                    }

                                    if( key_date < date_length ) {
                                       
                                        connection.monitoring_logs.aggregate(
                                            { 
                                                $match: {

                                                    "monitoring_id":new ObjectID(result_monitoring[key]['_id']),'app_id': app_id,'created':{ $gte: from_date, $lte:to_date},'status':{$ne:'Success'} 
                                                  } 
                                                },
                                                 { 
                                                    $project : {monitoring_id : 1,created:1,status:1,app_id:1} 
                                            }, 
                                                { "$sort": { "_id" : 1 } }, function( err_monitoring, res_logs ) {

                                                    var res_logs_data = [];
                                                    if( res_logs.length>0 ) {
                                                        
                                                        for( var i=0; i<res_logs.length; i++ ) {

                                                            var created_date = res_logs[i]['created'];
                                                            created_date = lib._time_zone_data( time_zone,created_date );
                                                            //created_date = created_date.toISOString();
                                                            //created_date = created_date.split('.')[0].replace('T', ' ');
                                                            var created_date_new = date_format(created_date, "HH:MM:ss");
                                                            if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
                                                              
                                                              var created_date_new = date_format(created_date, "yyyy-mm-dd HH:MM:ss");
                                                            
                                                            }
                                                            res_logs_data[i] = created_date_new+' '+res_logs[i]['status'];
                                                        }
                                                    }

                                                    var res_data = "";
                                                    if( res_logs_data.length>0 ) {

                                                        res_data = res_logs_data;
                                                    }
                                                    date_wise_result[selected_dates[key_date]] = res_data;
                                                    
                                                    key_date ++;
                                                    date_wise_logs( key_date );

                                        });

                                    } else {

                                        final_results[result_monitoring[key]['title']] = date_wise_result;
                                        key ++;
                                        monitoring_logs( key );
                                    }
                                }

                                date_wise_logs( key_date );
    
                           /* } else {

                                key ++;
                                monitoring_logs( key );
                            }
                        });*/
                    } else {

                        var date_range = lib.start_end_date( date_arr ,day_month_wise );
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = monitoring__fetch_data;
                        response['params'] = final_results;
                        response['date_range'] = date_arr.reverse(); 
                        response['start_end_date'] = date_range; 
                        res.json(response);
                    }
                }

                monitoring_logs( key );
            } else {
                response['authCode'] = apps_error_code;
                response['authMessage'] = monitoring_data;
                response['params'] = monitoring_data;
                res.json(response);
            }
        });
      
      function top_event_data_function(monitoring_data_create) {

                  var final_results = {};
                  var date_results = [];
                  var monitoring_data_creates = 0;
                  var final_results_new = {};
                  function top_event_data_fetch(monitoring_data_creates)
                 {
                    if(monitoring_data_creates<monitoring_data_create.length)
                    {
                      connection.monitoring.find({"_id":new ObjectID(monitoring_data_create[monitoring_data_creates]['_id']['monitoring_id']),'status':'active'},function(err,fetch_monitoring_name){
                       
                       if(fetch_monitoring_name.length>0){
                           connection.monitoring_logs.find({"monitoring_id":new ObjectID(fetch_monitoring_name[0]['_id']),'created': { $gte: time_before_days, $lt:current_date_new_s},'status':{$ne:'Success'} },function(err,monitoring_logs_create){
                                  //console.log(monitoring_logs_create);
                                  if(monitoring_logs_create.length>0)
                                  {

                                    for(var logs_data = 0;logs_data<monitoring_logs_create.length;logs_data++){
                                  
                                      var created_date = monitoring_logs_create[logs_data]['created'];

                                      created_date = created_date.toISOString();
                                      created_date = created_date.split('.')[0].replace('T', ' ');
                                      var created_date_new = date_format(created_date, "HH:MM:ss");
                                      created_date = date_format(created_date, "yyyy-mm-dd");
                                       for( var res_dates in date_arr ) {

                                        final_results[date_arr[res_dates]] = "";
                                        if(created_date==date_arr[res_dates]){
                                         
                                          date_results[monitoring_data_creates] = {[created_date_new]:monitoring_logs_create[logs_data]['status']};
                                          final_results[date_arr[res_dates]] = date_results;

                                        }
                                      }      
                                
                                  }
                                }
                                monitoring_data_creates++;
                                top_event_data_fetch(monitoring_data_creates);
                                final_results_new[fetch_monitoring_name[0]['title']] = final_results;
                            });
                          }else{
                                monitoring_data_creates++;
                                top_event_data_fetch(monitoring_data_creates);
                          }
                        });
                    
                    }else{
                        res.send(final_results_new);
                    } 
                       
                 }
                 top_event_data_fetch(monitoring_data_creates)  

      }

    });    

});


router.get('/monitoring/chart/:app_id', function(req, res, next) {

    var app_id = new ObjectID(req.params.app_id);
    var event_id = new ObjectID(req.headers.event_id);
    var field = req.headers.field;
    var no_of_days = req.headers.no_of_days;
    var start_date = req.headers.start_date;
    var end_date = req.headers.end_date;
    var chart_type = req.headers.chart_type;
    var day_month_wise = req.headers.day_month_wise;

    
    var response = {};
    var time_before_days;
    var current_date_new_s;
    if(lib.is_not_empty(field)){
    
      time_zone_query(app_id,function( time_zone ) {
          
          var current_date_new = new Date();
          var current_date_new = new Date(current_date_new.getTime());

          var current_date = lib._time_zone_data( time_zone,current_date_new );
          current_date = new Date(current_date);
          //Find month according to time zone
          var year = date_format(current_date, "yyyy");
          var day = date_format(current_date, "dd");
          var day_month = lib.daysInMonth( day,year );

          
          if(no_of_days=='custom'){

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
          if(no_of_days=='custom') { 

            no_of_days_new = day_date_diff;

          } else { 

            no_of_days_new = no_of_days;
          }

          var day_month_query;
          var date_arr = [];
          var date_format_r;
          if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
              
              day_month_query = { format: "%Y-%m", date: "$last_time" };
              date_format_r = "yyyy-mm";
              for( var i=0; i < no_of_days_new; i++ ) {

                var date_i =  i*day_month;
                var created_date_on = new Date(current_date.getTime() + (-date_i*24*60*60*1000));
                created_date_on = created_date_on.toISOString();
                created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                created_date_on = date_format(created_date_on,date_format_r);
                date_arr[i] = created_date_on;
              
              }

          } else {
              
              day_month_query = { format: "%Y-%m-%d", date: "$last_time" };
              date_format_r = "yyyy-mm-dd";
              for( var i=0; i < no_of_days_new; i++ ) {

                var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
                created_date_on = created_date_on.toISOString();
                created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                created_date_on = date_format(created_date_on, date_format_r);
                date_arr[i] = created_date_on;
              
              }
          }

          var date_arr = date_arr.sort();

          var selected_dates = {};
          for( var j = 0; j < date_arr.length; j++ ) {
              selected_dates[j] = date_arr[j];
          }

          var event_data_field = "event_data."+field;
          connection.user_tracks.aggregate({ $match: {"app_id":app_id,"event_id":event_id,[event_data_field]:{'$ne':null},'last_time': { $gte: time_before_days, $lt:current_date_new_s }}}, 
          { $project : { monitoring_id : 1,last_time: { $dateToString: day_month_query},status:1,event_data:1,event_id:1} }, 
          { $group : { _id : { "event_data": "$event_data."+field}, total : { $sum : 1 }} }, 
          { "$sort": { "_id" : 1 }}, function( err_monitoring, result_group_users) {console.log(result_group_users);


            var key=0;
            var final_response = [];
            //res.send(result_group_users);
            if(chart_type!="pi"){
              
              function user_group_function(key){

                if(result_group_users.length>key){
                    
                    var user_field_name= result_group_users[key]['_id']['event_data'][0];

                    connection.user_tracks.aggregate({ $match: {"app_id":app_id,[event_data_field]:user_field_name,"event_id":event_id,'last_time': { $gte: time_before_days, $lt:current_date_new_s } }}, 
                      { $project : { monitoring_id : 1,last_time: { $dateToString: day_month_query},status:1,event_data:1,event_id:1} }, 
                      { $group : { _id : {"last_time":"$last_time"}, total : { $sum : 1 }} }, 
                      { "$sort": { "_id" : 1 }}, function( err_monitoring, result_user_tracks ) {    

                        var user_date_arr = [];
                        var final_results = {};
                        var date_results = [];
                        var date_length = Object.keys(selected_dates).length;
                        
                        if(date_length>0)
                        {
                          for(var key_date=0;key_date<date_length;key_date++) {

                            if(result_user_tracks.length>0){
                                
                                var total;
                                date_results[key_date] = 0; 
                                for(var i=0;i<result_user_tracks.length;i++){

                                  var last_time = lib._time_zone_data( time_zone,result_user_tracks[i]['_id']['last_time'] );
                                  last_time = date_format(last_time,date_format_r);
   
                                  if(selected_dates[key_date]==last_time)
                                  {
                                    date_results[key_date] = result_user_tracks[i]['total'];
                                  }
                                }

                            }
                          }
                        }
                        var name_ss;
                        if( typeof(result_group_users[key]['_id']['event_data'][0])=="object" ) {

                            var object_length = Object.keys(result_group_users[key]['_id']['event_data'][0]).length;
                            var name_s = "";
                            for( var keys in  result_group_users[key]['_id']['event_data'][0]) {

                              name_s = keys;
                            
                            }
                            //var name_s =  name_s.slice(0, -2);
                            name_ss = name_s;
                        
                        } else {

                            name_ss = result_group_users[key]['_id']['event_data'][0];
                        }
                        final_response[key] = {
                
                          'name':name_ss,
                          'data':date_results
                        }; 
                        key++;
                        user_group_function(key);

                    });
                    
                }else{
                  
                      if(final_response.length>0){

                        var date_range = lib.start_end_date( date_arr ,day_month_wise );
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = monitoring__fetch_data;
                        response['params'] = final_response;
                        response['date_range'] = date_arr;
                        response['start_end_date'] = date_range;   
                        res.json(response);
                      
                      }else{

                        response['authCode'] = apps_error_code;
                        response['authMessage'] = custom_data_not_found;
                        response['params'] = final_response;
                        response['date_range'] = date_arr;  
                        res.json(response);  
                      }
                }

              }
              user_group_function(key);

            } else {
                    
                  connection.user_tracks.aggregate({ $match: {"app_id":app_id,"event_id":event_id,[event_data_field]:{'$ne':null},'last_time': { $gte: time_before_days, $lt:current_date_new_s }}}, 
                  { $project : { monitoring_id : 1,last_time: { $dateToString: day_month_query},status:1,event_data:1,event_id:1} }, 
                  { $group : { _id : { "event_id": "$event_id"}, total : { $sum : 1 }}}, 
                  { "$sort": { "_id" : 1 }}, function( err_monitoring, result_tracks_total) {
                          
                          if(result_group_users.length>0){
                            
                            for(var i=0;i<result_group_users.length;i++){
                                
                                var name_ss;
                                
                                if( typeof(result_group_users[i]['_id']['event_data'][0])=="object" ) {

                                    var object_length = Object.keys(result_group_users[i]['_id']['event_data'][0]).length;
                                    var name_s = "";
                                    for( var keys in  result_group_users[i]['_id']['event_data'][0]) {

                                      name_s = keys;
                                    
                                    }
                                   // name_s =  name_s.slice(0, -2);
                                    name_ss = name_s;
                                
                                } else {

                                  name_ss = result_group_users[i]['_id']['event_data'][0];
                                }

                                final_response[i] = {
                            
                                      'name':name_ss,
                                      'y':round((result_group_users[i]['total']/result_tracks_total[0]['total'])*100,2)
                                    };
                            }
                            
                            var date_range = lib.start_end_date( date_arr ,day_month_wise );
                            response['authCode'] = apps_success_code;
                            response['authMessage'] = monitoring__fetch_data;
                            response['params'] = final_response;
                            response['start_end_date'] = date_range;
                            res.json(response);
                  

                          }else{

                            response['authCode'] = apps_error_code;
                            response['authMessage'] = custom_data_not_found;
                            response['params'] = final_response; 
                            res.json(response);
                          }
                });
            }
          });
      
      });
    
    } else {
        
        response['authCode'] = apps_error_code;
        response['authMessage'] = "field can not be empty";
        response['params'] = "field can not be empty";
        res.json(response);  
  }

});

function round(number, precision) {
    var pair = (number + 'e').split('e')
    var value = Math.round(pair[0] + 'e' + (+pair[1] + precision))
    pair = (value + 'e').split('e')
    return +(pair[0] + 'e' + (+pair[1] - precision))
}
function top_event_data_function(monitoring_data_create) {

                var final_results = {};
                var date_results = [];
                var monitoring_data_creates = 0;
                var final_results_new = {};
                function top_event_data_fetch(monitoring_data_creates)
               {
                  if(monitoring_data_creates<monitoring_data_create.length)
                  {
                    connection.monitoring.find({"_id":new ObjectID(monitoring_data_create[monitoring_data_creates]['_id']['monitoring_id']),'status':'active'},function(err,fetch_monitoring_name){
                     
                     if(fetch_monitoring_name.length>0){
                         connection.monitoring_logs.find({"monitoring_id":new ObjectID(fetch_monitoring_name[0]['_id']),'created': { $gte: time_before_days, $lt:current_date_new_s},'status':{$ne:'Success'} },function(err,monitoring_logs_create){
                                //console.log(monitoring_logs_create);
                                if(monitoring_logs_create.length>0)
                                {

                                  for(var logs_data = 0;logs_data<monitoring_logs_create.length;logs_data++){
                                
                                    var created_date = monitoring_logs_create[logs_data]['created'];

                                    created_date = created_date.toISOString();
                                    created_date = created_date.split('.')[0].replace('T', ' ');
                                    var created_date_new = date_format(created_date, "HH:MM:ss");
                                    created_date = date_format(created_date, "yyyy-mm-dd");
                                     for( var res_dates in date_arr ) {

                                      final_results[date_arr[res_dates]] = "";
                                      if(created_date==date_arr[res_dates]){
                                       
                                        date_results[monitoring_data_creates] = {[created_date_new]:monitoring_logs_create[logs_data]['status']};
                                        final_results[date_arr[res_dates]] = date_results;

                                      }
                                    }      
                              
                                }
                              }
                              monitoring_data_creates++;
                              top_event_data_fetch(monitoring_data_creates);
                              final_results_new[fetch_monitoring_name[0]['title']] = final_results;
                          });
                        }else{
                              monitoring_data_creates++;
                              top_event_data_fetch(monitoring_data_creates);
                        }
                      });
                  
                  }else{
                      res.send(final_results_new);
                  } 
                     
               }
               top_event_data_fetch(monitoring_data_creates)  

}  

router.get('/logs/data', function(req, res, next) {

  var user_id = req.headers.user_id;
  var app_id = req.headers.app_id
  var flag = req.headers.flag;
  
  if(req.headers.offset!=0)
  {
   var offset = (req.headers.offset-1)*item_per_page; 
  }else{
   var offset = 0;
  }
  var skip=parseInt(item_per_page)+parseInt(offset);

  var response = {}; 
 
    var logs_data_arr = {};
    
    if ( lib.is_not_empty(user_id) ) {

        logs_data_arr['user_id'] = new ObjectID(user_id);
    }

    if ( lib.is_not_empty(app_id) ) {

        logs_data_arr['app_id'] = new ObjectID(app_id);
    }

    if ( lib.is_not_empty(flag) ) {

        logs_data_arr['flag'] = flag;
    }

  
  if ( lib.is_not_empty(user_id) )
  {

      connection.user_activity_logs.find(logs_data_arr,function( err, data_exist ){
        
        if(lib.is_not_empty(data_exist)){
        
          response['authCode'] = apps_success_code;
          response['authMessage'] = "Logs data fetch successfully.";
          response['params'] = data_exist; 
          res.json(response);
        
        } else {

              response['authCode'] = apps_error_code;
              response['authMessage'] = "Logs data is not found.";
              response['params'] = "Logs data is not found."; 
              res.json(response);
        }

      }).sort({"_id":-1}).limit(1);

  } else {

      response['authCode'] = apps_error_code;
      response['authMessage'] = "Please enter user_id";
      response['params'] = "Please enetr user_id"; 
      res.json(response);
  }

});


router.get('/get_all_logs/data', function(req, res, next) {

  var user_id = req.headers.user_id;
  var app_id = req.headers.app_id
  var flag = req.headers.flag;
  
  if(req.headers.offset!=0)
  {
   var offset = (req.headers.offset-1)*item_per_page; 
  }else{
   var offset = 0;
  }
  var skip=parseInt(item_per_page)+parseInt(offset);

  var response = {}; 
 
    var logs_data_arr = {};
    
    if ( lib.is_not_empty(user_id) ) {

        logs_data_arr['user_id'] = new ObjectID(user_id);
    }

    if ( lib.is_not_empty(app_id) ) {

        logs_data_arr['app_id'] = new ObjectID(app_id);
    }

    if ( lib.is_not_empty(flag) ) {

        logs_data_arr['flag'] = flag;
    }

  
  if ( lib.is_not_empty(user_id) )
  {

      connection.user_activity_logs.find(logs_data_arr,function( err, data_exist ){
        
        if(lib.is_not_empty(data_exist)){
        
          response['authCode'] = apps_success_code;
          response['authMessage'] = "Logs data fetch successfully.";
          response['params'] = data_exist; 
          res.json(response);
        
        } else {

              response['authCode'] = apps_error_code;
              response['authMessage'] = "Logs data is not found.";
              response['params'] = "Logs data is not found."; 
              res.json(response);
        }

      }).sort({"_id":-1});

  } else {

      response['authCode'] = apps_error_code;
      response['authMessage'] = "Please enter user_id";
      response['params'] = "Please enetr user_id"; 
      res.json(response);
  }

});

router.get('/monitoring/table/:app_id', function(req, res, next) {

    var app_id = new ObjectID(req.params.app_id);
    var event_id = new ObjectID(req.headers.event_id);
    var field = req.headers.field;
    var no_of_days = req.headers.no_of_days;
    var start_date = req.headers.start_date;
    var end_date = req.headers.end_date;
    var chart_type = req.headers.chart_type;
    var day_month_wise = req.headers.day_month_wise;
    
    var response = {};
    var time_before_days;
    var current_date_new_s;
    time_zone_query(app_id,function( time_zone ) {
        
        var current_date_new = new Date();
        var current_date_new = new Date(current_date_new.getTime());

        var current_date = lib._time_zone_data( time_zone,current_date_new );
        current_date = new Date(current_date);
        //Find month according to time zone
        var year = date_format(current_date, "yyyy");
        var day = date_format(current_date, "dd");
        var day_month = lib.daysInMonth( day,year );

        
        if(no_of_days=='custom'){

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
        if(no_of_days=='custom') { 

          no_of_days_new = day_date_diff;

        } else { 

          no_of_days_new = no_of_days;
        }

        var day_month_query;
        var date_arr = [];
        var date_format_r;
        if(lib.is_not_empty(day_month_wise) && day_month_wise == "is_month" ) {
            
            day_month_query = { format: "%Y-%m", date: "$last_time" };
            
            for( var i=0; i < no_of_days_new; i++ ) {

              date_format_r = "yyyy-mm";
              var date_i =  i*day_month;
              var created_date_on = new Date(current_date.getTime() + (-date_i*24*60*60*1000));
              created_date_on = created_date_on.toISOString();
              created_date_on = created_date_on.split('.')[0].replace('T', ' ');
              created_date_on = date_format(created_date_on,date_format_r);
              date_arr[i] = created_date_on;
            
            }

        } else {
            
            day_month_query = { format: "%Y-%m-%d", date: "$last_time" };
            date_format_r = "yyyy-mm-dd";
            for( var i=0; i < no_of_days_new; i++ ) {

              var created_date_on = new Date(current_date.getTime() + (-i*24*60*60*1000));
              created_date_on = created_date_on.toISOString();
              created_date_on = created_date_on.split('.')[0].replace('T', ' ');
              created_date_on = date_format(created_date_on, date_format_r);
              date_arr[i] = created_date_on;
            
            }
        }

        var date_arr = date_arr.sort();

        var selected_dates = {};
        for( var j = 0; j < date_arr.length; j++ ) {
            selected_dates[j] = date_arr[j];
        }

        var event_data_field = "event_data."+field;
        connection.user_tracks.aggregate({ $match: {"app_id":app_id,"event_id":event_id,[event_data_field]:{'$ne':null},'last_time': { $gte: time_before_days, $lt:current_date_new_s }}}, 
        { $project : { monitoring_id : 1,last_time: { $dateToString: day_month_query},status:1,event_data:1,event_id:1} }, 
        { $group : { _id : { "event_data": "$event_data."+field}, total : { $sum : 1 }} }, 
        { "$sort": { "_id" : 1 }}, function( err_monitoring, result_group_users) {

          var key=0;
          var final_response = [];
          //res.send(result_group_users);
        /*0*/
                  
                connection.user_tracks.aggregate({ $match: {"app_id":app_id,"event_id":event_id,[event_data_field]:{'$ne':null},'last_time': { $gte: time_before_days, $lt:current_date_new_s }}}, 
                { $project : { monitoring_id : 1,last_time: { $dateToString: day_month_query},status:1,event_data:1,event_id:1} }, 
                { $group : { _id : { "event_id": "$event_id"}, total : { $sum : 1 }}}, 
                { "$sort": { "_id" : 1 }}, function( err_monitoring, result_tracks_total) {
                        
                        if(result_group_users.length>0){

                          for(var i=0;i<result_group_users.length;i++){


                              var name_ss = result_group_users[i]['_id']['event_data'][0];

                              if( typeof(result_group_users[i]['_id']['event_data'][0])=="object" ) {

                                  var object_length = Object.keys(result_group_users[i]['_id']['event_data'][0]).length;
                                  var name_s = "";
                                  for( var keys in  result_group_users[i]['_id']['event_data'][0]) {

                                    name_s += result_group_users[i]['_id']['event_data'][0][keys]+', ';
                                  
                                  }
                                  name_s =  name_s.slice(0, -2);
                                  name_ss = name_s;
                              }

                              final_response[i] = {
                          
                                    'name':name_ss,
                                    'percentage_of_rec':round((result_group_users[i]['total']/result_tracks_total[0]['total'])*100,2),
                                    "total_no_of":result_group_users[i]['total']

                              };
                          }
                           var date_range = lib.start_end_date( date_arr ,day_month_wise );
                          response['authCode'] = apps_success_code;
                          response['authMessage'] = monitoring__fetch_data;
                          response['params'] = final_response;
                          response['start_end_date']  = date_range;
                          res.json(response);
                

                        }else{

                          response['authCode'] = apps_error_code;
                          response['authMessage'] = custom_data_not_found;
                          response['params'] = final_response; 
                          res.json(response);
                        }
              });
         // }
        });
    
    });
});

/*router.get('/logs_data/new', function(req, res, next){

  // require file system and jsdom
  var fs = require('fs');
  var jsdom = require('jsdom').jsdom;
   
  // create default jsdom view
  var d = jsdom('<body><div id="container"></div></body>');
  var w = d.defaultView;
   
  // require anychart and anychart export modules
  var anychart = require('anychart')(w);
  var anychartExport = require('anychart-nodejs')(anychart);
   
  // create and a chart to the jsdom defaultView 
  var chart = anychart.pie([10, 20, 7, 18, 30]);
  chart.container('container');
  chart.bounds(0, 0, 800, 600);
  chart.draw();
   
  // generate JPG image and save it to a file
  anychartExport.exportTo(chart, 'jpg').then(function(image) {
    fs.writeFile('anychart.jpg', image, function(fsWriteError) {
      if (fsWriteError) {
        
        console.log(fsWriteError.message);
      } else {
        console.log('Complete');
      }
      process.exit(0);
    });
  }, function(generationError) {
    console.log(generationError.message);
    process.exit(1);
  });

})*/
module.exports = router;