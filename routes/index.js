/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

const util = require('util');
var config = require('../config');
var app = require('../app'),
    url = require("url"),
    querystring = require('querystring'),
    request     = require('request'),
    shopifyAPI  = require('shopify-node-api'),
    fs = require('fs'),
    moment = require('moment'),
    _ = require('lodash'),
    Logger = require('le_node');

var log = new Logger({
  token:process.env.loggerToken
    // token: config.cfg.loggerToken
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.mandrill_key /*config.cfg.mandrill_key*/);

var Shopify;

var setShopify = function(req, res) {
    var parsedUrl = url.parse(req.originalUrl, true);
    req.session.shopUrl = 'https://caramel-dev.myshopify.com';
    //In case server stops and starts again, check if we need the auth token again
    req.session.oauth_access_token = process.env.aTK;
    // req.session.oauth_access_token = config.cfg.aTK;
    if (!req.session.oauth_access_token) {
        if (parsedUrl.query && parsedUrl.query.shop) {
        req.session.shopUrl = 'https://' + parsedUrl.query.shop;
        }

        res.redirect('/auth_app');
    }
    else {
        //Using the shopify node.js library to make the calls to Shopify. This var is the configuration object.
        Shopify = new shopifyAPI({
            shop: req.session.shopUrl.split('//')[1],
            shopify_api_key: app.nconf.get('oauth:api_key'),
            // shopify_api_key: config.cfg["oauth:api_key"],
            shopify_shared_secret: app.nconf.get('oauth:client_secret'),
            // shopify_shared_secret: config.cfg["oauth:client_secret"],
            access_token: req.session.oauth_access_token,
            // access_token: config.cfg.aTK,
            verbose: false
        });
    }
};

/*
 * Get /
 *
 * if we already have an access token then
 * redirect to render the app, otherwise
 * redirect to app authorisation.
 */
exports.index = function(req, res){
    res.redirect('/render_app');
    return;
    setShopify(req, res);
    if (!req.session.oauth_access_token) {
        var parsedUrl = url.parse(req.originalUrl, true);
        if (parsedUrl.query && parsedUrl.query.shop) {
          req.session.shopUrl = 'https://' + (parsedUrl.query.shop || 'caramel-dev.myshopify.com');
        }
        res.redirect("/auth_app");
    }
    else {
        res.redirect("/render_app");
    }
};





/*
 * Get /render_app
 *
 * render the main app view
 */
exports.renderApp = function(req, res){
    setShopify(req, res); 
    var parsedUrl = url.parse(req.originalUrl, true);
    res.render('index');
};

exports.getDiscounts = function(req,res){
    setShopify(req, res);
    Shopify.get('/admin/discounts.json', function(err, data, headers) {
        res.json({data:data, err:err, headers:headers});
    });
};


exports.bookProduct = function(req, res) {
    setShopify(req, res);
    var parsedUrl = url.parse(req.originalUrl, true);
    db.Product
    .findOrCreate({where: {customerEmail:req.body.customerEmail,variantId:req.body.variantId, status:req.body.status}, defaults:req.body})
    .spread(function(product, created) {
      var product = product.get({plain: true});
        res.json({product:product,created:created, email:'success'});
        return;
      // if (req.body.type == 'book-in-store') {
      //     var subject = "Rezervare produs",
      //         template_name = "Comanda ta este in curs de rezervare!",
      //         template_content = [{
      //           "name": "Rezervare produs",
      //           "content": "Rezervare produs"
      //         }];
      // }
      // if (req.body.type == 'preorder') {
      //     var subject = "Precomanda produs",
      //         template_name = "Precomanda ta a fost inregistrata cu succes!",
      //         template_content = [{
      //           "name": "Precomanda produs",
      //           "content": "Precomanda produs"
      //         }];
      // }
      // if (req.body.type == 'book-confirmation') {
      //     var subject = "Rezervare produs: Succes!",
      //         template_name = "Comanda ta te asteapta in magazinul Caramel!",
      //         template_content = [{
      //           "name": "Rezervare produs",
      //           "content": "Rezervare produs"
      //         }];
      // }
      // var message = {
      //         "subject": subject,
      //         "from_email": "contact@caramel.ro",
      //         "from_name": "Caramel Fashion",
      //         "to": [{
      //                 "email": product.customerEmail,
      //                 "name": product.customerFirstName+' '+product.customerLastName,
      //                 "type": "to"
      //             }],
      //         "merge": true,
      //         "merge_language": "mailchimp",
      //         "merge_vars": [{
      //                 "rcpt": product.customerEmail,
      //                 "vars": [{
      //                           "name": "username",
      //                           'content':product.customerLastName
      //                         }, {
      //                           'name': 'storeName',
      //                           'content':product.store
      //                         }, {
      //                           'name': 'pTitle',
      //                           'content':product.name
      //                         }, {
      //                           'name':'pQty',
      //                           'content':product.quantity
      //                         }, {
      //                           'name':'pVariant',
      //                           'content':product.variant.split('-')[0]
      //                         }, {
      //                           'name':'pPrice',
      //                           'content':product.variant.split('-')[1]
      //                         }, {
      //                           'name':'pLink',
      //                           'content':product.link
      //                         }]
      //             }],
      //     };

      
      // var async = false;
      // var sendObject = {"template_name": template_name, "template_content": template_content, "message": message, "async": async};

      // mandrill_client.messages.sendTemplate(sendObject, function(result) {

      //     res.json({product:product,created:created, email:'success'});

          /*
          [{
                  "email": "recipient.email@example.com",
                  "status": "sent",
                  "reject_reason": "hard-bounce",
                  "_id": "abc123abc123abc123abc123abc123"
              }]
          */
      // }, function(e) {
      //     // Mandrill returns the error as an object with name and message keys
      //     res.json({product:product,created:created, email:'error'});
      //     // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
      // });
    });
};

exports.bookConfirmation = function(req, res) {
  db.Product
    .findOne({where: {id:req.params.productId}})
    .then(function(product) {
      product.set('status', 'email-sent').save().then(function(product) {
          // var product = product.get({plain: true});
          var product = product.dataValues;
          var subject = "Rezervare produs: Succes!",
          template_name = "Comanda ta te asteapta in magazinul Caramel!",
          template_content = [{
            "name": "Rezervare produs",
            "content": "Rezervare produs"
          }];
          var message = {
                  "subject": subject,
                  "from_email": "contact@caramel.ro",
                  "from_name": "Caramel Fashion",
                  "to": [{
                          "email": product.customerEmail,
                          "name": product.customerFirstName+' '+product.customerLastName,
                          "type": "to"
                        },
                        {
                          "email": "ccristian.moldovan@yahoo.com",
                          "name": product.customerFirstName+' '+product.customerLastName,
                          "type": "bcc"
                        },
                        {
                          "email": "oana.elena.blaga@gmail.com",
                          "name": product.customerFirstName+' '+product.customerLastName,
                          "type": "bcc"
                        }],
                  "bcc_address": "message.bcc_address@example.com",
                  "merge": true,
                  "merge_language": "mailchimp",
                  "global_merge_vars": [{
                                    "name": "username",
                                    'content':product.customerLastName
                                  }, {
                                    'name': 'storeName',
                                    'content':product.store
                                  }, {
                                    'name': 'pTitle',
                                    'content':product.name
                                  }, {
                                    'name':'pQty',
                                    'content':product.quantity
                                  }, {
                                    'name':'pVariant',
                                    'content':product.variant.split('-')[0]
                                  }, {
                                    'name':'pPrice',
                                    'content':product.variant.split('-')[1]
                                  }, {
                                    'name':'pLink',
                                    'content':product.link
                                  }, {
                                    'name':'crtDate',
                                    'content': moment().format("DD.MM.YYYY")
                                  }]
//                   "merge_vars": [{
//                           "rcpt": product.customerEmail,
//                           "vars": [{
//                                     "name": "username",
//                                     'content':product.customerLastName
//                                   }, {
//                                     'name': 'storeName',
//                                     'content':product.store
//                                   }, {
//                                     'name': 'pTitle',
//                                     'content':product.name
//                                   }, {
//                                     'name':'pQty',
//                                     'content':product.quantity
//                                   }, {
//                                     'name':'pVariant',
//                                     'content':product.variant.split('-')[0]
//                                   }, {
//                                     'name':'pPrice',
//                                     'content':product.variant.split('-')[1]
//                                   }, {
//                                     'name':'pLink',
//                                     'content':product.link
//                                   }, {
//                                     'name':'crtDate',
//                                     'content': moment().format("DD.MM.YYYY")
//                                   }]
//                       }],
              };

          
          var async = false;
          var sendObject = {"template_name": template_name, "template_content": template_content, "message": message, "async": async};

          mandrill_client.messages.sendTemplate(sendObject, function(result) {
              log.log("debug", {email:"sent", customerEmail:product.customerEmail, customerLastName:product.customerLastName, customerFirstName:product.customerFirstName});
              // res.redirect("/render_app");
              res.json(product);

              /*
              [{
                      "email": "recipient.email@example.com",
                      "status": "sent",
                      "reject_reason": "hard-bounce",
                      "_id": "abc123abc123abc123abc123abc123"
                  }]
              */
          }, function(e) {
              // Mandrill returns the error as an object with name and message keys
              // res.redirect("/render_app");
              res.json(e);
              // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
          });
        });
    });
};


exports.preorderProduct = function(req, res) {
  setShopify(req, res);
  var parsedUrl = url.parse(req.originalUrl, true);
  db.Product
    .findAll({
      where: {type:'preorder'},
      raw:true,
      offset: 0,
      limit: 250
    })
    .then(function(products) {
      res.json(products);
    });
};

exports.deleteProduct = function(req, res) {
  setShopify(req, res);
  var parsedUrl = url.parse(req.originalUrl, true);
  db.Product
    .findOne({where:{id:req.params.id}})
    .then(function(product) {
      product.set({status:'picked', deletedAt:moment().format('YYYY-MM-DD kk:mm:ss')}).save().then(function() {
        res.json(product);
      });
    });
//     db.Product
//     .destroy({where:{id:req.params.id}, force:true})
//     .then(function(affectedRows) {
//       res.json(affectedRows);
//     });
};

exports.softDeleteProduct = function(req, res) {
  setShopify(req, res);
  var parsedUrl = url.parse(req.originalUrl, true);
  db.Product
        .findOne({where:{id:req.params.id}})
        .then(function(product) {
          product.set({status:'picked', deletedAt:moment().format('YYYY-MM-DD kk:mm:ss')}).save().then(function() {
            // res.json(product);
            Shopify.put('/admin/variants/'+product.dataValues.variantId+'.json',
            {
              "variant": {
                "id": parseInt(product.dataValues.variantId),
                "inventory_quantity_adjustment": -1
              }
            },
            function(err, data, headers) {
                res.json(product);
            });
          });
        });
};

exports.viewProduct = function(req, res) {
    setShopify(req, res);
    Shopify.get('/admin/metafields.json?namespace=book-in-store', function(err, data, headers) {
        res.render('view-product', {
            title: 'Configuration',
            apiKey: app.nconf.get('oauth:api_key'),
            shopUrl: req.session.shopUrl,
            product: data.product,
        });
    });
};


exports.getProducts = function(req, res) {
  var filters = req.query;

  if (filters.status == 'null'){
    filters.status = 'null';
  }

  if (filters.status == 'all') {
    delete filters.status;
  }
  
  if (filters.status == 'email-sent') {
    filters.deletedAt = null;
  }

  db.Product.findAll({
      where:filters,
      paranoid: false,
      raw:true,
      offset: 0,
      limit: 250
  })
  .then(function(products) {
      res.json(products);
  });
};
