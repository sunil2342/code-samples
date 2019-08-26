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
var current_date = new Date(current_date_new.getTime());
//var bodyParser = require( 'body-parser' );
//router.use(bodyParser.json());
//var multer          =       require('multer');
//router.use(bodyParser.urlencoded({"extended" : true}));

/* GET content of marters */
router.post('/add', function(req, res, next) {

    var response = {};
    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var app_slug = req.body.app_slug;
    var app_name = lib.ucfirst(req.body.app_name);
    var app_type = req.body.app_type;
    var random_app_id = req.body.random_app_id;
    var timezone = req.body.timezone;
    var app_pages = req.body.app_pages;
    var client_id = new ObjectID(req.body.client_id);

    var app_data_arr = {};
    if(lib.is_not_empty(app_slug) && lib.is_not_empty(app_name) && lib.is_not_empty(app_type) && lib.is_not_empty(random_app_id) && lib.is_not_empty(client_id))
    {
      app_data_arr['app_slug'] = app_slug;
      app_data_arr['app_name'] = app_name;
      app_data_arr['status'] = 'active';
      app_data_arr['random_app_id'] = random_app_id;
      app_data_arr['app_type'] = app_type;
      app_data_arr['client_id'] = client_id;
      app_data_arr['created'] = current_date;
      app_data_arr['modified'] = current_date;
      app_data_arr['timezone'] = timezone;
      app_data_arr['app_pages'] = app_pages;
     
      var save_apps_data_connection = connection.apps(app_data_arr);
      connection.apps.find({'app_name':app_name,'status':'active'},function(err,data){
          if(data.length>0)
          {
                response['authCode'] = apps_error_code;
                response['authMessage'] = apps_name_exist;
                response['params'] = apps_name_exist;
                res.json(response);

          }else{
               var event_data_arr = {};
                var event_data_arr1 = {};
               save_apps_data_connection.save( function( err, result ) {
                /*function key (preFix) {
                  
                  if (preFix == 'a') {
                      return s4();
                  }
                  if (preFix == 'e') {
                      return s4() + '-' +s4();
                  }
                }
                function s4 () {
                  return Math.floor(Math.random()*90000) + 10000;
                }
                var random_key = key('e');
                var random_event_id = 'e-'+random_app_id+'-'+random_key;
                var default_date = date_format("1111-11-11","yyyy-mm-dd hh:mm:ss");
                //save by deafult login and logout events
                event_data_arr['event_slug'] = app_name.substr(1,2)+'-page-load';
                event_data_arr['event_name'] = 'Page_Load';
                event_data_arr['status'] = 'active';
                event_data_arr['total_count'] = 0;
                event_data_arr['type'] = 'System';
                event_data_arr['random_event_id'] = random_event_id;
                event_data_arr['app_id'] = result._id;
                event_data_arr['last_triggred'] = default_date;
                event_data_arr['created'] = current_date;
                event_data_arr['modified'] = current_date;
                //res.send(event_data_arr);
                var save_events_data_connection = connection.events(event_data_arr);
                save_events_data_connection.save( function( err, result ) {
                });
                function keys(preFix) {
                  
                  if (preFix == 'a') {
                      return s5();
                  }
                  if (preFix == 'e') {
                      return s5() + '-' +s5();
                  }
                }
                function s5 () {
                  return Math.floor(Math.random()*80000) + 10000;
                }
                var random_key = key('e');
                var random_keys =keys('e'); 
                var random_event_id = 'e-'+random_app_id+'-'+random_key;
                var random_event_id1 = 'e-'+random_app_id+'-'+random_keys;
                //save by deafult login and logout events
                event_data_arr['event_slug'] =  app_name.substr(1,2)+'-logout';
                event_data_arr['event_name'] = 'Logout';
                event_data_arr['status'] = 'active';
                event_data_arr['total_count'] = 0;
                event_data_arr['type'] = 'System';
                event_data_arr['random_event_id'] = random_event_id1;
                event_data_arr['app_id'] = result._id;
                event_data_arr['last_triggred'] = default_date;
                event_data_arr['created'] = current_date;
                event_data_arr['modified'] = current_date;
                //res.send(event_data_arr);
                var save_events_data_connection = connection.events(event_data_arr);
                save_events_data_connection.save( function( err, result ) {
                });*/
                //End of the code here
                  response['authCode'] = apps_success_code;
                  response['authMessage'] = app_save;
                  response['last_insert_id'] = result._id;
                 // console.log(response);
                  res.json(response);

              });
          }
      });
     
    }else{
      if(!lib.is_not_empty(app_slug))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_aap_slug;
        response['params'] = empty_aap_slug;
        res.json(response);

      }else if(!lib.is_not_empty(app_name))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_aap_name;
        response['params'] = empty_aap_name;
        res.json(response);
      }else if(!lib.is_not_empty(app_type))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_aap_type;
        response['params'] = empty_aap_type;
        res.json(response);
      
      }else if(!lib.is_not_empty(client_id))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = client_empty;
        response['params'] = client_empty;
        res.json(response);
      }           
    }

  //res.send("hello anupam");
});

router.get('/', function(req, res, next) {

  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());

  var response = {};
  var user_status_cond;
  var client_id = req.headers.client_id;

  if(lib.is_not_empty(client_id)){

    user_status_cond = {'status':'active','client_id':new ObjectID(client_id)}
 
  }else{
    user_status_cond = {'status':'active'};
  }
  connection.apps.find(user_status_cond,function(err,data){

      if(data.length>0)
      {

        response['authCode'] = apps_success_code;
        response['authMessage'] = fetch_data;
        response['params'] = data;
        res.json(response);

      }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = apps_data_not_found;
        response['params'] = apps_data_not_found;
        res.json(response);
      }

  }).sort( { '_id': -1} );

  //res.send("hello anupam");
});

router.get('/:id', function(req, res, next) {
  
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime());

  var app_id = req.params.id;
  var response = {};
  var apps_arr = {};
  var app_data_arr = {};
  connection.apps.find({'_id':app_id,'status':'active'},function(err,data){

      if(lib.is_not_empty(data) && data.length>0)
      {
        connection.account_users.find({'_id':new ObjectID(data[0]['client_id'])},function(errss,client_data){

          var client_name="";
          if(lib.is_not_empty(client_data)){
            client_name = client_data[0]['title'];
          }
          apps_arr['_id'] = data[0]['_id'];
          apps_arr['app_slug'] = data[0]['app_slug'];
          apps_arr['app_name'] = data[0]['app_name'];
          apps_arr['status'] = data[0]['status'];
          apps_arr['random_app_id'] = data[0]['random_app_id'];
          apps_arr['app_type'] = data[0]['app_type'];
          apps_arr['client_id'] = data[0]['client_id'];
          apps_arr['timezone'] = data[0]['timezone'];
          apps_arr['modified'] = data[0]['modified'];
          apps_arr['created'] = data[0]['created'];
          apps_arr['app_pages'] = data[0]['app_pages'];
          apps_arr['client_name'] = client_name;
          var new_apps_arr = [];
          new_apps_arr[0] = apps_arr;

          //Update modified time 
          app_data_arr['modified'] = current_date;
          //Update modified time 
          connection.apps.update( { '_id' : new ObjectID(app_id) }, { '$set' : app_data_arr }, { upsert: true }, function( err_update, result_update ) {
          
            response['authCode'] = apps_success_code;
            response['authMessage'] = fetch_data;
            response['params'] = new_apps_arr;
            res.json(response);

          });

        });

      } else {

        response['authCode'] = apps_error_code;
        response['authMessage'] = apps_data_not_found;
        response['params'] = apps_data_not_found;
        res.json(response);
      }

  });

  //res.send("hello anupam");
});


router.put('/:id', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime());

    var response = {};
    var app_id = req.params.id;
    var app_slug = req.body.app_slug;
    var app_name = lib.ucfirst(req.body.app_name);
    var app_type = req.body.app_type;
    var timezone = req.body.timezone;
    var app_pages = req.body.app_pages;
    var client_id = new ObjectID(req.body.client_id)

    var app_data_arr = {};
   if(lib.is_not_empty(app_slug) && lib.is_not_empty(app_name) && lib.is_not_empty(app_type) && lib.is_not_empty(client_id))
   {

      app_data_arr['app_slug'] = app_slug;
      app_data_arr['app_name'] = app_name;
      app_data_arr['app_type'] = app_type;
      app_data_arr['modified'] = current_date;
      app_data_arr['timezone'] = timezone;
      app_data_arr['app_pages'] = app_pages;
      app_data_arr['client_id'] = client_id;
     connection.apps.find({'app_name':app_name,'status':'active','_id':{$ne:app_id}},function(err,data_exist){
        if(data_exist.length>0)
        {
             response['authCode'] = apps_error_code;
             response['authMessage'] = apps_name_exist;
             response['params'] = apps_name_exist;
             res.json(response);
        }else{

            connection.apps.find({'_id':new ObjectID(app_id)},function(err,data){
              if(data.length>0)
              {
                connection.apps.update( { '_id' : new ObjectID(app_id) }, { '$set' : app_data_arr }, { upsert: true }, function( err_update, result_update ) {
                        
                        response['authCode'] = apps_success_code;
                        response['authMessage'] = app_update;
                        response['params'] = app_update;
                        res.json(response);
                });
             }else{
                response['authCode'] = apps_error_code;
                response['authMessage'] = apps_data_not_found;
                response['params'] = apps_data_not_found;
                res.json(response);
             }
           });
        }
    });
   
   }else{
        if(!lib.is_not_empty(app_slug))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_aap_slug;
          response['params'] = empty_aap_slug;
          res.json(response);

        }
        if(!lib.is_not_empty(app_name))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_aap_name;
          response['params'] = empty_aap_name;
          res.json(response);
        }
     
        if(!lib.is_not_empty(app_type))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_aap_type;
          response['params'] = empty_aap_type;
          res.json(response);
        }else if(!lib.is_not_empty(client_id))
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = client_empty;
          response['params'] = client_empty;
          res.json(response);
        }   
   }

});

router.delete('/', function(req, res, next) {

    var response = {};
    var app_id = req.headers.app_id;
    var app_data_arr = {};
    app_data_arr['status'] = 'inactive';
    app_data_arr['modified'] = current_date;
    connection.apps.find({'_id':new ObjectID(app_id),'status':'active'},function(err,data){
      if(data.length>0)
      {
        connection.apps.update( { '_id' : new ObjectID(app_id) }, { '$set' : app_data_arr }, { upsert: true }, function( err_update, result_update ) {
                    
            response['authCode'] = apps_success_code;
            response['authMessage'] = app_deleted;
            response['params'] = app_deleted;
            res.json(response);
        });
      }else{
          response['authCode'] = apps_error_code;
          response['authMessage'] = apps_data_not_found;
          response['params'] = apps_data_not_found;
          res.json(response);
      }
    });
});
module.exports = router;