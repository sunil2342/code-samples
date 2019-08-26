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
var current_date = new Date(current_date_new.getTime() + (+330*60*1000));
//var nodemailer = require('nodemailer');
/*var transporter = nodemailer.createTransport({

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

/* GET content of masters */

router.post('/add', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

    var username = req.body.username;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email_address = req.body.email_address;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var permissions = req.body.permissions;
    var created_by = new ObjectID(req.body.created_by);
    var modified_by = new ObjectID(req.body.modified_by);
    var client_id = new ObjectID(req.body.client_id);
    var user_type = req.body.user_type;

    var response = {};
    var user_data_arr = {};
    //console.log(typeof(permissions));
    if(lib.is_not_empty(created_by) && lib.is_not_empty(username) && lib.is_not_empty(first_name) && lib.is_not_empty(last_name) && lib.is_not_empty(email_address) && lib.is_not_empty(password) && lib.is_not_empty(confirm_password) && lib.is_not_empty(client_id))
    {   

        connection.account_users.find({'_id':client_id,'status':'active'},function(err,client_name_exist){
          
          var client_name = "";
          if(client_name_exist.length>0)
          {
            client_name = client_name_exist[0]['title'];
          }
          user_data_arr['username'] = username;
          user_data_arr['first_name'] = first_name;
          user_data_arr['last_name'] = last_name;
          user_data_arr['email_address'] = email_address;
          user_data_arr['password'] = md5(password);
          user_data_arr['status'] = 'active';
          user_data_arr['permissions'] = permissions;
          user_data_arr['created_by'] = created_by;
          user_data_arr['modified_by'] = modified_by;
          user_data_arr['created'] = current_date;
          user_data_arr['modified'] = current_date;
          user_data_arr['user_type'] = user_type;
          user_data_arr['client_id'] = client_id;
          user_data_arr['title'] = client_name;

          save_user_data(user_data_arr);
      });
    }else{
      empty_data_validation()
    }

   function save_user_data(user_data_arr)
   {
     connection.account_users.find({'username':username,'status':'active'},function(err,username_exist){
        if(username_exist.length>0)
        {
          response['authCode'] = apps_error_code;
          response['authMessage'] = username_exist_data;
          response['params'] = username_exist_data;
          res.json(response);

        }else{
          connection.account_users.find({'email_address':email_address,'status':'active'},function(err,email_exist){
              if(email_exist.length>0)
              {
                 response['authCode'] = apps_error_code;
                 response['authMessage'] = email_exist_data;
                 response['params'] = email_exist_data;
                 res.json(response);

              }else{ 
                  if(password==confirm_password)
                  { 
                      var save_users_data_connection = connection.account_users(user_data_arr);
                      save_users_data_connection.save( function( err, result ) {

                        response['authCode'] = apps_success_code;
                        response['authMessage'] = user_data_save;
                        response['params'] = user_data_save;
                        res.json(response);
                      });
                  }else{
                     response['authCode'] = apps_error_code;
                     response['authMessage'] = password_match;
                     response['params'] = password_match;
                     res.json(response);

                  }
              }
          });
        }
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
      }else
      if(!lib.is_not_empty(first_name))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_first_name;
        response['params'] = empty_first_name;
        res.json(response);
      }else
      if(!lib.is_not_empty(last_name))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_last_name;
        response['params'] = empty_last_name;
        res.json(response);
      }else
      if(!lib.is_not_empty(email_address))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_email_address;
        response['params'] = empty_email_address;
        res.json(response);
      }else
      if(!lib.is_not_empty(password))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_password;
        response['params'] = empty_password;
        res.json(response);
      }else
      if(!lib.is_not_empty(confirm_password))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_confirm_password;
        response['params'] = empty_confirm_password;
        res.json(response);
      }else
      if(!lib.is_not_empty(permissions))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = permission_data;
        response['params'] = permission_data;
        res.json(response);
      }else if(!lib.is_not_empty(created_by))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = empty_created_by;
        response['params'] = empty_created_by;
        res.json(response);
      }else if(!lib.is_not_empty(client_id))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = client_empty;
        response['params'] = client_empty;
        res.json(response);
      }/*else if(!lib.is_not_empty(user_type))
      {
        response['authCode'] = apps_error_code;
        response['authMessage'] = user_type_empty;
        response['params'] = user_type_empty;
        res.json(response);
      }*/
   }

});
router.get('/', function(req, res, next) {

  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

  var item_per_page = parseInt(req.headers.item_per_page);
  var offset = (req.headers.offset-1)*item_per_page;
  var sort_by = req.headers.sort_by;
  var order_by = parseInt(req.headers.order_by);
  var skip=item_per_page+parseInt(offset);
  var client_id = req.headers.client_id;
  var user_type = req.headers.user_type;
  var loggedIn_userId = new ObjectID(req.headers.loggedin_userid);

  var response = {};
  if(lib.is_not_empty(sort_by) && lib.is_not_empty(order_by))
  {
      var user_status_cond;
      //if(lib.is_not_empty(client_id)){
         
          if(lib.is_not_empty(user_type) && user_type=="admin"){

              user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'user_type':{$ne:'c_s_admin'},'_id':{$ne:loggedIn_userId}}

          
          }else if(lib.is_not_empty(user_type) && user_type=="user"){

              user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'user_type':'user','_id':{$ne:loggedIn_userId}};
          
          }else if(lib.is_not_empty(user_type) && user_type=="c_s_admin"){


            user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'_id':{$ne:loggedIn_userId}};

          }else{

            if(lib.is_not_empty(client_id)){

              user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'_id':{$ne:loggedIn_userId}};
            
            }else{

              user_status_cond = {'status':'active','_id':{$ne:loggedIn_userId}};
            }
          }

      /*}else{//SuperAdmin case

        user_status_cond = {'status':'active','_id':{$ne:loggedIn_userId}};
      
      }*/

    connection.account_users.count(user_status_cond,function(err,account_count){

      account_user_count(account_count);
    
    });
    function account_user_count(account_count)
    {
       var query_sort_data = [
              {
                $project:
                {
                  'username':1,'user_type':1,'first_name':1,'last_name':1,'email_address':1,'title':1,'client_id':1,'status':1,'modified':1,'created':1,'insensitive':1,
                  insensitive: { "$toUpper": "$"+sort_by}
                }
              },
               { "$sort": { "insensitive": order_by} }, 
              {
                $match:{
                  $and:[user_status_cond]
              },
            },
              { $limit : skip},
              {$skip:offset},
            ];
        connection.account_users.aggregate(query_sort_data,function(err,data_exist){
         
          var account_arr = [];
          if(lib.is_not_empty(data_exist) && data_exist.length>0)
          {
            for(var i=0;i<data_exist.length;i++)
            {
              var created_date_on_time;
              if(lib.is_not_empty(data_exist[i]['created']))
              {
                 created_date_on_time = lib.time_format(data_exist[i]['created']);
              }else{
                created_date_on_time = "";
              }
              var modified_date_on_time;
              if(lib.is_not_empty(data_exist[i]['modified']))
              {
                 modified_date_on_time = lib.time_format(data_exist[i]['modified']);
              }else{
                modified_date_on_time = "";
              }
              account_arr[i] = {
                'account_user_id':data_exist[i]['_id'],
                'username':data_exist[i]['username'],
                'email_address':data_exist[i]['email_address'],
                'first_name':data_exist[i]['first_name'],
                'last_name':data_exist[i]['last_name'],
                'email_address':data_exist[i]['email_address'],
                'client_name':data_exist[i]['title'],
                'user_type':data_exist[i]['user_type'],
                'created':created_date_on_time,
                'modified':modified_date_on_time
              };
            }
            response['authCode'] = apps_success_code;
            response['authMessage'] = fetch_data;
            response['params'] = account_arr;
            response['total_count'] = account_count;
            res.json(response);
          
          }else{

            response['authCode'] = apps_error_code;
            response['authMessage'] = account_user_data_not_found;
            response['params'] = account_user_data_not_found;
            res.json(response);
          }
        })
    }
  }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = "Please enter sort_by and order_by";
        response['params'] = "Please enter sort_by and order_by";
        res.json(response);
  }
});

router.get('/slug', function(req, res, next) {

  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

  var slug = req.headers.slug;
  var response = {};
  if(lib.is_not_empty(slug)){
    
    connection.account_users.find({'status':'active','slug':slug},function(err,slug_data_exists){
      
      if(lib.is_not_empty(slug_data_exists) && slug_data_exists.length){
          
          var slug_arr = {};
          slug_arr['client_id'] = slug_data_exists[0]['_id'];
          response['authCode'] = apps_success_code;
          response['authMessage'] = slug_data_fetch;
          response['params'] = slug_arr;
          res.json(response);
      
      }else{

          response['authCode'] = apps_error_code;
          response['authMessage'] = slug_not_found;
          response['params'] = slug_not_found;
          res.json(response);
      }
    });
  
  }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = not_empty_slug;
        response['params'] = not_empty_slug;
        res.json(response);
  }
});

router.get('/id/:account_user_id', function(req, res, next) {

    var account_user_id = req.params.account_user_id;

    connection.account_users.find({'status':'active','_id':account_user_id},function(err,data_exist){
      var response = {};
      if(lib.is_not_empty(data_exist) && data_exist.length>0)
      {
        //find data for creating for the account users
        connection.account_users.find({'status':'active','_id':new ObjectID(data_exist[0]['created_by'])},function(err,created_by_data){

          if(created_by_data.length>0)
          {
            account_user_data_created(created_by_data[0]['first_name'],created_by_data[0]['last_name']);
          }else{
            account_user_data_created('','');
          }
        });
        //Find data for modified foe the account users
        function account_user_data_created(first_name_c,last_name_c)
        {
          connection.account_users.find({'status':'active','_id':new ObjectID(data_exist[0]['modified_by'])},function(err,modified_by_data){

            if(modified_by_data.length>0)
            {
              account_user_data_modified(modified_by_data[0]['first_name'],modified_by_data[0]['last_name'],first_name_c,last_name_c);
            }else{
              account_user_data_modified('','','','');
            }
          });
        }
        var account_trigger_arr = {};
        function account_user_data_modified(first_name_m,last_name_m,first_name_c,last_name_c)
        {

            var created_by = first_name_c+' '+first_name_c;
            var modified_by = first_name_m+' '+last_name_m; 
            //Set the created_by and modified_by in account users
            var created_date_on_time;
            if(lib.is_not_empty(data_exist[0]['created']))
            {
               created_date_on_time = lib.time_format(data_exist[0]['created']);
            }else{
              created_date_on_time = "";
            }
            var modified_date_on_time;
            if(lib.is_not_empty(data_exist[0]['modified']))
            {
               modified_date_on_time = lib.time_format(data_exist[0]['modified']);
            }else{
              modified_date_on_time = "";
            }
             connection.account_users.find({'_id':new ObjectID(data_exist[0]['client_id'])},function(errss,client_data){

            var client_name="";
            
            if(lib.is_not_empty(client_data)){
              client_name = client_data[0]['title'];
            }

            account_trigger_arr['_id'] = data_exist[0]._id;
            account_trigger_arr['username'] = data_exist[0].username;
            account_trigger_arr['first_name'] = data_exist[0].first_name;
            account_trigger_arr['last_name'] = data_exist[0].last_name;
            account_trigger_arr['email_address'] = data_exist[0].email_address;
            account_trigger_arr['password'] = data_exist[0].password;
            account_trigger_arr['status'] = data_exist[0].status;
            account_trigger_arr['client_id'] = data_exist[0].client_id;
            account_trigger_arr['permissions'] = data_exist[0].permissions;
            account_trigger_arr['created'] = created_date_on_time;
            account_trigger_arr['modfied'] = modified_date_on_time;
            account_trigger_arr['created_by'] = created_by;
            account_trigger_arr['client_name'] = client_name;
            account_trigger_arr['slug'] = data_exist[0].slug;;
            account_trigger_arr['user_type'] = data_exist[0]['user_type'];
            account_trigger_arr['title'] = data_exist[0]['title'];
            account_trigger_arr['contact_number'] = data_exist[0]['contact_number'];
            account_trigger_arr['client_status'] = data_exist[0]['client_status'];
            account_trigger_arr['notify'] = data_exist[0]['notify'];

            
            response['authCode'] = apps_success_code;
            response['authMessage'] = fetch_data;
            response['params'] = account_trigger_arr;
            res.json(response);
            });
        } 
      }else{

        response['authCode'] = apps_error_code;
        response['authMessage'] = account_user_data_not_found;
        response['params'] = account_user_data_not_found;
        res.json(response);
      }
    });

});

router.put('/change_password/:account_user_id', function(req, res, next) {
  
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

  var account_user_id = new ObjectID(req.params.account_user_id); 
  var new_password = req.headers.new_password;
  var confirm_password = req.headers.confirm_password;
  var old_password = req.headers.old_password;
  var modified_by = req.headers.modified_by;  
  
  var response = {};
  if(lib.is_not_empty(account_user_id) && lib.is_not_empty(new_password) && lib.is_not_empty(confirm_password) && lib.is_not_empty(old_password))
  {
    connection.account_users.find({'status':'active','_id':account_user_id},function(err,data_exist){
        var response = {};
        var account_data_arr = {};
        
        if(data_exist.length>0)
        {
          if(new_password==confirm_password)
          {
            if(md5(old_password)==data_exist[0]['password'])
            {
              account_data_arr['password'] = md5(new_password);
              account_data_arr['modified'] = current_date;
              account_data_arr['modified_by'] = new ObjectID(modified_by);
              connection.account_users.update( { '_id' : account_user_id }, { '$set' : account_data_arr }, { upsert: true }, function( err_update, result_update ) {

                response['authCode'] = apps_success_code;
                response['authMessage'] = password_changed;
                response['params'] = password_changed;
                res.json(response);

              });  
            }else{
              response['authCode'] = apps_error_code;
              response['authMessage'] = old_new_password;
              response['params'] = old_new_password;
              res.json(response);
            }
          }else{
              response['authCode'] = apps_error_code;
              response['authMessage'] = match;
              response['params'] = match;
              res.json(response);
          } 
        
        }else{

          response['authCode'] = apps_error_code;
          response['authMessage'] = account_user_data_not_found;
          response['params'] = account_user_data_not_found;
          res.json(response);
        }
    });
  }else{
      if(!lib.is_not_empty(account_user_id))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_account_user_id;
          response['params'] = empty_account_user_id;
          res.json(response);
      }else
      if(!lib.is_not_empty(new_password))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_new_password;
          response['params'] = empty_new_password;
          res.json(response);
      }else
      if(!lib.is_not_empty(confirm_password))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_confirm_password;
          response['params'] = empty_confirm_password;
          res.json(response);
      }else
      if(!lib.is_not_empty(old_password))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_old_password;
          response['params'] = empty_old_password;
          res.json(response);
      }
  }
});

router.put('/:account_user_id', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

    var account_user_id = new ObjectID(req.params.account_user_id);
    //var username = req.body.username;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email_address = req.body.email_address;
    var password = req.body.password;
    var username = req.body.username;
    var permissions = req.body.permissions;
    var contact_number = req.body.contact_number;
    var notify = req.body.notify;
    var client_status = req.body.client_status;
    var title = req.body.title;
    var client_id = req.body.client_id;
    var user_type = req.body.user_type;
    var slugs = req.body.slug;
    var created_by = new ObjectID(req.body.created_by);
    var modified_by = new ObjectID(req.body.modified_by);


    var response = {};
    var account_data_arr = {};
    if(lib.is_not_empty(first_name) && lib.is_not_empty(email_address) && lib.is_not_empty(account_user_id))
    {
      if(lib.is_not_empty(title) && user_type=='c_s_admin'){

        connection.account_users.find({'title':title,'status':'active','_id':{$ne:account_user_id},'user_type':'c_s_admin'},function(errors,client_name_exists){
               
            if(client_name_exists.length>0)
            {
              response['authCode'] = apps_error_code;
              response['authMessage'] = client_name;
              response['params'] = client_name;
              res.json(response);

            }else{
              client_edit_data();
            }
        });

      }else{

          client_edit_data();
      }
      
      function client_edit_data(){
     
         connection.account_users.find({'status':'active','_id':account_user_id},function(err,data_exist){
           
           connection.account_users.find({'status':'active','_id':{$ne:account_user_id},'email_address':email_address},function(err,email_exist){
              if(email_exist.length>0)
              {
                response['authCode'] = apps_error_code;
                response['authMessage'] = email_exist_data;
                response['params'] = email_exist_data;
                res.json(response);
              
              }else{
                if(data_exist.length>0)
                {
                  connection.account_users.find({'status':'active','_id':{$ne:account_user_id},'username':username},function(err,user_exist){

                    if(user_exist.length>0)
                    {
                      response['authCode'] = apps_error_code;
                      response['authMessage'] = username_exist_data;
                      response['params'] = username_exist_data;
                      res.json(response);
                    
                    }else{
                      var account_data_arr1 = {};

                      var slug = lib.getSlug(slugs);
                      var rand_slug = lib.random_getSlug(title);
                      connection.account_users.find({'client_id':new ObjectID(client_id),'status':'active','user_type':'c_s_admin'},function(err,client_name_exist){
                        
                        connection.account_users.find({'slug':slugs,'status':'active','_id':{$ne:account_user_id},'user_type':'c_s_admin'},function(errors,slug_name_exists){
          
                              var client_name = "";
                              if(client_name_exist.length>0)
                              {
                                client_name = client_name_exist[0]['title'];
                              }

                              if(lib.is_not_empty(first_name)){
                                
                                account_data_arr['first_name'] = first_name;
                              }
                              if(lib.is_not_empty(first_name)){
                                
                                account_data_arr['username'] = username;
                              }
                              if(lib.is_not_empty(last_name))
                              {
                                account_data_arr['last_name'] = last_name;
                              }
                              if(lib.is_not_empty(email_address)){
                                
                                account_data_arr['email_address'] = email_address;
                              }
                              if(lib.is_not_empty(permissions)){
                                account_data_arr['permissions'] = permissions;
                              }
                              if(lib.is_not_empty(contact_number)){
                                
                                account_data_arr['contact_number'] = contact_number;
                              }
                              if(lib.is_not_empty(notify)){

                                account_data_arr['notify'] = notify;
                              }
                              if(lib.is_not_empty(user_type)){
                                
                                account_data_arr['user_type'] = user_type;
                              }
                              if(lib.is_not_empty(client_status)){
                                
                                account_data_arr['client_status'] = client_status;
                              }
                              if(lib.is_not_empty(title)){
                                
                                account_data_arr['title'] = title;
                                account_data_arr1['title'] = title;
                                if(slug_name_exists.length>0)
                                {
                                  account_data_arr['slug'] = rand_slug;
                                }else{
                                  account_data_arr['slug'] = slug;
                                }
                              }else{
                                account_data_arr['title'] = client_name;
                                account_data_arr1['title'] = client_name;
                              }
                              if(lib.is_not_empty(client_id)){
                                
                                account_data_arr['client_id'] = new ObjectID(client_id);
                              }
                              account_data_arr['modified'] = current_date;
                              if(lib.is_not_empty(modified_by)){
                                
                                account_data_arr['modified_by'] = modified_by;
                              }
                              
                              
                              connection.account_users.update( { '_id' : account_user_id }, { '$set' : account_data_arr }, { upsert: true }, function( err_update, result_update ) {
                                  
                                  if(user_type=='c_s_admin'){

                                    connection.account_users.update( { 'client_id' : account_user_id }, { '$set' : account_data_arr1 }, {  multi: true }, function( err_update, result_update ) {});
                                  }
                                  response['authCode'] = apps_success_code;
                                  response['authMessage'] = account_update;
                                  response['params'] = account_update;
                                  res.json(response);

                             });

                          });

                      });
                    }
                  });

                }else{

                    response['authCode'] = apps_error_code;
                    response['authMessage'] = account_user_data_not_found;
                    response['params'] = account_user_data_not_found;
                    res.json(response);
                }
              }
            });
         }); 
      }

    }else{
        if(!lib.is_not_empty(account_user_id))
        {
            response['authCode'] = apps_error_code;
            response['authMessage'] = empty_account_user_id;
            response['params'] = empty_account_user_id;
            res.json(response);
        }else
        if(!lib.is_not_empty(first_name))
        {
            response['authCode'] = apps_error_code;
            response['authMessage'] = empty_first_name;
            response['params'] = empty_first_name;
            res.json(response);
        }else
        if(!lib.is_not_empty(email_address))
        {
            response['authCode'] = apps_error_code;
            response['authMessage'] = empty_email_address;
            response['params'] = empty_email_address;
            res.json(response);
        }
    }

});

router.get('/search', function(req, res, next) {
  
  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+330*60*1000));
  
  var response = {};
  if(lib.is_not_empty(req.headers.item_per_page) && lib.is_not_empty(req.headers.offset) && lib.is_not_empty(req.headers.sort_by))
  {
        var item_per_page = parseInt(req.headers.item_per_page);
        var offset = (req.headers.offset-1)*item_per_page;
        var sort_by = req.headers.sort_by;
        var order_by = parseInt(req.headers.order_by);
        var search_string = req.headers.search_string;
        var skip=item_per_page+parseInt(offset);
        var user_type = req.headers.user_type;
        var client_id = req.headers.client_id;
        var loggedIn_userId = new ObjectID(req.headers.loggedIn_userId);
        var user_type = req.headers.user_type;

        /*var account_data_query = {$and: [{ "status" : 'active'},{$or:[{'username':{'$regex':search_string,$options: '-i'}},{$where : 'return this.created.getMonth() == parseInt("'+monthYearDay['month']+'")'},{$where : 'return this.created.getYear() == parseInt("'+monthYearDay['year']+'")'},{$where : 'return this.created.getDate() == parseInt('+monthYearDay['day']+')'},{'email_address':{'$regex':search_string,$options: '-i'}},{'last_name':{'$regex':search_string,$options: '-i'}},{'first_name':{'$regex':search_string,$options: '-i'}}]}]};*/
        var user_status_cond;
         
        if(lib.is_not_empty(user_type) && user_type=="admin"){

            user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'user_type':{$ne:'c_s_admin'},'_id':{$ne:loggedIn_userId}}

        
        }else if(lib.is_not_empty(user_type) && user_type=="user"){

            user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'user_type':'user','_id':{$ne:loggedIn_userId}};
        
        }else if(lib.is_not_empty(user_type) && user_type=="c_s_admin"){


          user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'_id':{$ne:loggedIn_userId}};

        }else{

            if(lib.is_not_empty(client_id)){

              user_status_cond = {'status':'active','client_id':new ObjectID(client_id),'_id':{$ne:loggedIn_userId}};
            
            }else{

              user_status_cond = {'status':'active','_id':{$ne:loggedIn_userId}};
            }
        }

       var like_query_statement = [
                          {second_created:parseInt(search_string)},
                          {year_created:parseInt(search_string)},
                          {month_created:parseInt(search_string)},
                          {hour_created:parseInt(search_string)},
                          {minute_created:parseInt(search_string)},
                          {day_created:parseInt(search_string)},
                          //Find data by modfied date

                          {day_modified:parseInt(search_string)},
                          {second_modified:parseInt(search_string)},
                          {year_modified:parseInt(search_string)},
                          {month_modified:parseInt(search_string)},
                          {hour_modified:parseInt(search_string)},
                          {minute_modified:parseInt(search_string)},

                          {'username':{'$regex':search_string,$options: '-i'}},
                          {'email_address':{'$regex':search_string,$options: '-i'}},
                          {'last_name':{'$regex':search_string,$options: '-i'}},
                          {'first_name':{'$regex':search_string,$options: '-i'}},
                          {'title':{'$regex':search_string,$options: '-i'}}

                        ];
       var account_data_query =   
            [
              {
                $project:
                {
                  //find value for created date
                  
                  'username':1,'first_name':1,'client_id':1,'title':1,'_id':1,'user_type':1,'last_name':1,'email_address':1,'title':1,'status':1,'app_id':1,'created':1,'modified':1,'status':1,
                  insensitive: { "$toUpper": "$"+sort_by}
                }
              }, 
              { "$sort": { "insensitive": order_by} }, 
                {
                  $match:{
                    $and:[user_status_cond],
                    $or:like_query_statement
                } 
              },
              { $limit : skip},
              {$skip:offset} 
            ];
            

            var account_data_query_count =    
            {
                $and:[user_status_cond],
                $or:like_query_statement                     
            };

       connection.account_users.aggregate(account_data_query,function(err,account_data){

          connection.account_users.count(account_data_query_count,function(err,count_account_data){
            var account_arr = [];
            if(lib.is_not_empty(account_data) && account_data.length>0)
            {
              for(var i=0;i<account_data.length;i++)
              {
                //Created date format
                var created_date_on = account_data[i]['created'];
                created_date_on = created_date_on.toISOString();
                created_date_on = created_date_on.split('.')[0].replace('T', ' ');
                var created_on = date_format(created_date_on, "mm/dd/yyyy HH:MM");
                //Modified date format
                var modified_date_on = account_data[i]['modified'];
                modified_date_on = modified_date_on.toISOString();
                modified_date_on = modified_date_on.split('.')[0].replace('T', ' ');
                var modified_on = date_format(modified_date_on, "mm/dd/yyyy HH:MM");
                account_arr[i] = {
                  'account_user_id':account_data[i]['_id'],
                  'username':account_data[i]['username'],
                  'email_address':account_data[i]['email_address'],
                  'first_name':account_data[i]['first_name'],
                  'last_name':account_data[i]['last_name'],
                  'client_name':account_data[i]['title'],
                  'email_address':account_data[i]['email_address'],
                  'user_type':account_data[i]['user_type'],
                  'created':created_on,
                  'modified':modified_on
                };
              }
            }
            response['authCode'] = apps_success_code;
            response['authMessage'] = fetch_data;
            response['params'] = account_arr;
            response['total_count'] = count_account_data;
            res.json(response);
          });
       })
  }else{
        response['authCode'] = apps_error_code;
        response['authMessage'] = item_per_page_offset;
        response['params'] = item_per_page_offset;
        res.json(response);
  }
});

router.delete('/', function(req, res, next) {

    response = {};
    var account_user_id_str = req.headers.account_user_id_str;
    var modified_by = req.headers.modified_by;
    var account_data_arr = {};
    

    if(lib.is_not_empty(account_user_id_str))
    {
      var account_user_arr = account_user_id_str.split(',');
      for(i=0;i<account_user_arr.length>0;i++)
      {
        account_data_arr['status'] = 'inactive';
        account_data_arr['modified_by'] = new ObjectID(modified_by);
        account_data_arr['modified'] = current_date;
       //Delete account user
        connection.account_users.update( { '_id' : new ObjectID(account_user_arr[i]) }, { '$set' : account_data_arr }, { upsert: true }, function( err_update, result_update ) {});
        //Delete cross account users by client id
        connection.account_users.update( { 'client_id' : new ObjectID(account_user_arr[i]) }, { '$set' : account_data_arr }, { multi: true }, function( err_updates, result_updates ) {});
        //Delete the apps by client id
        connection.apps.update( { 'client_id' : new ObjectID(account_user_arr[i]) }, { '$set' : account_data_arr }, { multi: true }, function( err_updatess, result_updatess) {});

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

router.put('/edit/:account_user_id', function(req, res, next) {

    var current_date_new = new Date();
    var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

    var account_user_id = new ObjectID(req.params.account_user_id);
    //var username = req.body.username;
    var first_name = req.headers.first_name;
    var last_name = req.headers.last_name;
    var username = req.headers.username;
    var email_address = req.headers.email_address;
    var modified_by = new ObjectID(req.headers.modified_by);

    var response = {};
    var account_data_arr = {};
    if(lib.is_not_empty(first_name) && lib.is_not_empty(account_user_id) && lib.is_not_empty(account_user_id) && lib.is_not_empty(username) && lib.is_not_empty(email_address))
    {
       
       connection.account_users.find({'status':'active','_id':account_user_id},function(err,data_exist){

          connection.account_users.find({'status':'active','_id':{$ne:account_user_id},'username':username},function(err,username_exist){
            if(username_exist.length>0)
            {
              response['authCode'] = apps_error_code;
              response['authMessage'] = username_exist_data;
              response['params'] = username_exist_data;
              res.json(response);
            
            }else{

              connection.account_users.find({'status':'active','_id':{$ne:account_user_id},'email_address':email_address},function(err,email_exist){
                if(email_exist.length>0)
                {
                    response['authCode'] = apps_error_code;
                    response['authMessage'] = email_exist_data;
                    response['params'] = email_exist_data;
                    res.json(response);
                    
                }else{
                    if(data_exist.length>0)
                    {
                      /*connection.clients.find({'status':'active','_id':{$ne:new ObjectID(data_exist[0]['client_id'])},'email_address':email_address},function(errsss,email_client_exist){

                          if(lib.is_not_empty(email_client_exist))
                          {
                            response['authCode'] = apps_error_code;
                            response['authMessage'] = email_exist_data;
                            response['params'] = email_exist_data;
                            res.json(response);

                          }else{*/

                            account_data_arr['first_name'] = first_name;
                            account_data_arr['last_name'] = last_name;
                            account_data_arr['username'] = username; 
                            account_data_arr['email_address'] = email_address; 
                            account_data_arr['modified'] = current_date;
                            account_data_arr['modified_by'] = modified_by;
                            
                            //Update client informations
                           /* if(data_exist[0]['user_type']=='admin')
                            {
                                  //update email address
                                  var client_data_arr = {};
                                  client_data_arr['first_name'] = first_name;
                                  client_data_arr['last_name'] = last_name;
                                  client_data_arr['email_address'] = email_address;

                                  

                                          connection.clients.find({'status':'active','email_address':data_exist[0]['email_address']},function(errsss,email_addresss_exist){
                                              
                                              if(lib.is_not_empty(email_addresss_exist)){

                                                  connection.clients.update( { '_id' : email_addresss_exist[0]['_id'] }, { '$set' : client_data_arr }, { upsert: true }, function( err_update, result_update ) {});
                                              }
                                          });
                            }*/
                            //End of the code here
                            connection.account_users.update( { '_id' : account_user_id }, { '$set' : account_data_arr }, { upsert: true }, function( err_update, result_update ) {

                              response['authCode'] = apps_success_code;
                              response['authMessage'] = profile_updated;
                              response['params'] = profile_updated;
                              res.json(response);

                            });
                         /* }
                      });*/
                    }else{

                        response['authCode'] = apps_error_code;
                        response['authMessage'] = account_user_data_not_found;
                        response['params'] = account_user_data_not_found;
                        res.json(response);
                    }
                }
              });
            }
          });
       }); 

    } else { 

      if(!lib.is_not_empty(account_user_id))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_account_user_id;
          response['params'] = empty_account_user_id;
          res.json(response);
      }else if(!lib.is_not_empty(first_name))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_first_name;
          response['params'] = empty_first_name;
          res.json(response);
      }else if(!lib.is_not_empty(username))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = username_exist_data;
          response['params'] = username_exist_data;
          res.json(response);
      }else if(!lib.is_not_empty(email_address))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = empty_email_address;
          response['params'] = empty_email_address;
          res.json(response);
      }else if(!lib.is_not_empty(account_user_id))
      {
          response['authCode'] = apps_error_code;
          response['authMessage'] = Error_worng;
          response['params'] = Error_worng;
          res.json(response);
      }
    }

});
/*router.delete('/:account_user_id', function(req, res, next) {

    var account_user_id = new ObjectID(req.params.account_user_id);
    var response = {};
    var account_data_arr = {};
   connection.account_users.find({'status':'active','_id':account_user_id},function(err,data_exist){
      
      if(data_exist.length>0)
      {
            account_data_arr['status'] = 'inactive';
            account_data_arr['modified'] = current_date; 
            connection.account_users.update( { '_id' : account_user_id }, { '$set' : account_data_arr }, { upsert: true }, function( err_update, result_update ) {

              response['authCode'] = apps_success_code;
              response['authMessage'] = account_delete;
              response['params'] = account_delete;
              res.json(response);

            });

      }else{

          response['authCode'] = apps_error_code;
          response['authMessage'] = account_user_data_not_found;
          response['params'] = account_user_data_not_found;
          res.json(response);
      }

   }); 

});*/
router.post( '/forgot-password', function( req, res, next ){

  var user_email = req.headers.user_email;
  var response = {};

  if( lib.is_not_empty ( user_email ) ){

    function check_user_exist () {
      var user_data_query =    
            {
                $and:[{'status':'active'}],
                $or:[{"username":user_email}, {"email_address":user_email}]                    
            };
             
      connection.account_users.find(user_data_query,function( err_user_info, result_user_info ) {
        if (result_user_info.length == 0) {
          response['authCode'] = apps_error_code;
              response['authMessage'] = 'Email address is not registered with us.' ;
              response['params'] = {'errorMessage' : 'Email address is not registered with us.'};
              res.json(response);
        } else {
            var password_array = {};
            function send_notification_mail(){
                var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                var secret_key = '';
                var secretKey_encode = '';
                //res.send(Math.floor(Math.random(1,10));
                //res.send(characters.length);
                var rand = Math.floor((Math.random() * 10) + 1);
                

                for (var i = 0; i < 6; i++) {

                  secret_key += characters[rand+i];
                }
                //var secretKey_encode = new Buffer(secret_key).toString('base64');
      
                /*connection.query( "UPDATE `users` SET `secret_key` = '"+secretKey_encode+"' WHERE `id` = '"+result_user_info[0].id+"'", function( err_update, result_update ) {});*/

                var password_link = md5(secret_key);
                password_array['password'] = password_link;    
                connection.account_users.update( { '_id' : new ObjectID(result_user_info[0]['_id']) }, { '$set' : password_array }, { upsert: true }, function( err_update, result_update ) {});

                var mailOptions = {
                              
                              to:result_user_info[0]['email_address'],
                                subject: 'Forgot Password',
                                html:  '<html><body style="padding:0; margin:0; font-family:Arial, Helvetica, sans-serif; background:#e6e7e8;"><table width="600px" cellpadding="0" cellspacing="0" align="center"><tr><td align="center" height="80px" bgcolor="#E31A4C" style="border-radius:5px 5px 0 0;"><a href="#" style="color:#fff; float:left; margin-left:0; width:100%;"><img src="'+image_logo_url+'" alt="Logo" style="outline:none; vertical-align: middle;" /> </a></td></tr><tr><td style="padding:10px; background:#fff;"><table width="100%" border="0" cellspacing="0" cellpadding="8"><tr><td style="font-size:15px; color:#414042;" colspan="2">Hello <strong>'+result_user_info[0]['first_name']+' '+result_user_info[0]['last_name']+'<strong>,</td></tr><tr><td style="font-size:15px; color:#414042; font-weight:bold;" colspan="2"></td></tr><tr><td style="font-size:15px; color:#414042;" colspan="2">You have recieved a <strong>new password</strong>. Please find the details below to change your password.</td></tr><tr><td style="" colspan="2"><strong>New Password</strong> : '+secret_key+'</td></tr><tr><td style="height:10px;" colspan="2"></td></tr><tr><td style="margin-bottom:5px;" colspan="2"><div style="font-size:12px; color:#414042; display:block; margin:0px 0 5px; font-weight:bold;">Thanks</div><p style="font-size:12px; color:#414042; display:block; margin:0px 0 5px;">Analytics Team</p></td></tr></table></td></tr><tr><td align="center" height="25px" bgcolor="#E31A4C" style="border-radius:0 0 5px 5px; font-size:12px; color:#ffffff; display:block; margin:0px; padding:10px 0 0; font-weight:normal; text-align:center;"> © <a href="#" style="color:#ffffff; margin-left:0; display:inline-block; text-decoration:none;">Analytics </a>. 2016 All Rights Reserved</td></tr></table></body></html>',


                            };                 
                            
                            transporter.sendMail(mailOptions, function(error, info) {          
                            });
            
              }
              send_notification_mail();

              
              response['authCode'] = apps_success_code;
              response['authMessage'] = 'Your new password has been sent to your registed email address.' ;
              response['params'] = {'errorMessage':'Your new password has been sent to your registed email address.'};
              res.json(response);

          //res.json(secret_key);
        }
      });
    }
    check_user_exist();

  } else {
    response['authCode'] = apps_error_code;
    response['authMessage'] = 'Please enter an username or email' ;
    response['params'] = {'errorMessage' : 'Please enter an username or email'};
    res.json(response);
  }

});

router.post('/login', function( req, res, next ) {

  var current_date_new = new Date();
  var current_date = new Date(current_date_new.getTime() + (+330*60*1000));

  var user_email = req.body.user_email;
  var password = req.body.password;
  //var current_date = moment.tz(now, zone).format();
  var response = {};  
  if( lib.is_not_empty ( user_email ) && lib.is_not_empty ( password ) ) {

    function check_user_exist () {

            var event_data_query =    
            {
                $and:[{'status':'active'},{'password':md5(password)}],
                $or:[{"username":user_email}, {"email_address":user_email}]                    
            };
            var user_data_arr = {};
             connection.account_users.find(event_data_query,function(err,data_exist){
                if(lib.is_not_empty(data_exist) && data_exist.length>0)
                {

                  connection.account_users.find({"status":"active","_id":new ObjectID(data_exist[0]['client_id'])},function(err,client_data_exists){

                      connection.account_users.find({"status":"active","client_id":new ObjectID(data_exist[0]['client_id']),'client_status':'no','user_type':'c_s_admin'},function(err,client_exists){
                           
                            connection.user_activity_logs.find({"user_id":new ObjectID(data_exist[0]['_id'])},function( err,user_activity_logs_exist ) {
                                
                                  var app_id = "";
                                  var last_accessed_page = "";
                                  if( lib.is_not_empty(user_activity_logs_exist) && lib.is_not_empty(user_activity_logs_exist[0]['data'][0]['app_id']) ) {
                                    
                                    app_id = user_activity_logs_exist[0]['data'][0]['app_id'];
                                    
                                  }

                                  if( lib.is_not_empty(user_activity_logs_exist) && lib.is_not_empty(user_activity_logs_exist[0]['data'][0]['last_accessed_page']) ) {

                                    last_accessed_page = user_activity_logs_exist[0]['data'][0]['last_accessed_page'];
                                  }
                                  
                                  var client_name="";
                                  var client_ids = "";
                                  if(lib.is_not_empty(data_exist[0]['user_type']) && data_exist[0]['user_type']=="s_admin"){
                                    var client_name="";
                                    var client_ids = "";
                                    
                                  }else if(lib.is_not_empty(data_exist[0]['user_type']) && data_exist[0]['user_type']=="c_s_admin"){

                                     if(lib.is_not_empty(data_exist[0]['_id'])){

                                        client_ids = data_exist[0]['_id'];
                                      }         
                                      if(lib.is_not_empty(data_exist[0]['title'])){

                                        client_name = data_exist[0]['title'];
                                      } 

                                  }else{
                                      //var slug;
                                      if(lib.is_not_empty(client_data_exists) && client_data_exists[0]['title'])
                                      {
                                  
                                        client_name = client_data_exists[0]['title'];
                                        //slug = client_data_exists[0]['slug'];
                                      }/*else{
                                        slug = data_exist[0]['slug'];
                                      } */ 
                                      if(lib.is_not_empty(data_exist[0]['client_id'])){
                                        client_ids = data_exist[0]['client_id'];
                                      }                        
                                  }

                                  var slug;
                                  if(lib.is_not_empty(client_data_exists) && client_data_exists[0]['slug'])
                                  {
                                    slug = client_data_exists[0]['slug'];

                                  } else {

                                    slug = data_exist[0]['slug'];
                                  }  
                                  /*var client_ids = "";
                                  if(lib.is_not_empty(data_exist[0]['_id'])){
                                    
                                    client_ids = data_exist[0]['client_id'];
                                  }*/
                                  user_data_arr['account_user_id'] = data_exist[0]['_id'];
                                  user_data_arr['username'] = data_exist[0]['username'];
                                  user_data_arr['first_name'] = data_exist[0]['first_name'];
                                  user_data_arr['last_name'] = data_exist[0]['last_name'];
                                  user_data_arr['email_address'] = data_exist[0]['email_address'];
                                  user_data_arr['client_id'] = client_ids;
                                  user_data_arr['client_name'] = client_name;
                                  user_data_arr['user_type'] = data_exist[0]['user_type'];
                                  user_data_arr['permissions'] = data_exist[0]['permissions'];
                                  user_data_arr['slug'] = slug;
                                  user_data_arr['last_accessed_page'] = last_accessed_page;
                                  user_data_arr['last_accessed_app_id'] = app_id;
                                  //console.log(user_data_arr);
                                  
                                  if(lib.is_not_empty(client_exists) && client_exists.length>0) {
                                  
                                    response['authCode'] = apps_error_code;
                                    response['authMessage'] = 'Your account has been deactivated, Please contact your administrator.' ;
                                    response['params'] = 'Your account has been deactivated, Please contact your administrator.';
                                    res.json(response);
                                  
                                  } else {
                                    
                                    response['authCode'] = apps_success_code;
                                    response['authMessage'] = 'User login successfully' ;
                                    response['params'] = user_data_arr;
                                    res.json(response);
                                  }

                            }).sort({"_id":-1}).limit(1);
                      });
                  });

                } else {

                    response['authCode'] = apps_error_code;
                    response['authMessage'] = 'Invalid login details.' ;
                    response['params'] = {'errorMessage' : 'Invalid login details.'};
                    res.json(response);
                }
             });

    }

    check_user_exist();           

  } else {
    
    if( !lib.is_not_empty ( user_email ) && !lib.is_not_empty ( password ) ) {
      
          response['authCode'] = apps_error_code;
          response['authMessage'] = 'Invalid json request' ;
          response['params'] = {'errorMessage' : 'Please enter proper field'};
          res.json(response);
      } else{

        if ( !lib.is_not_empty ( user_email ) ) {

            response['authCode'] = apps_error_code;
            response['authMessage'] = 'Please enter an user email' ;
            response['params'] = {'errorMessage' : 'Please enter an user email'};
            res.json(response);

      } else if ( !lib.is_not_empty ( password ) ) {

            response['authCode'] = apps_error_code;
            response['authMessage'] = 'Please enter a password' ;
            response['params'] = {'errorMessage' : 'Please enter a password'};
            res.json(response);

        }
      }
  }

});
module.exports = router;