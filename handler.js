'use strict';
/* predefined code in comment below:
module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
*/
const request = require('axios');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const { extractListingsFromHTML_1 } = require('./helpers');
const { extractListingsFromHTML_2 } = require('./inberlinwohnen');
var nodemailer = require('nodemailer'); 

//const sitelist = {[extractListingsFromHTML_1]: 'https://www.mueller-merkle.de/angebote/?stadt=Berlin&zimmer=&wohnflaeche=0&preis_max=&objekttyp=&etage=&balkon_terrasse=&einbaukueche=#estates', 
  //                [extractListingsFromHTML_2]: 'https://inberlinwohnen.de/wohnungsfinder/'};
const sitelist = [[extractListingsFromHTML_1, 'https://www.mueller-merkle.de/angebote/?stadt=Berlin&zimmer=&wohnflaeche=0&preis_max=&objekttyp=&etage=&balkon_terrasse=&einbaukueche=#estates'], 
                [extractListingsFromHTML_2, 'https://inberlinwohnen.de/wohnungsfinder/'] ];

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'apartmentradar@outlook.de',
    pass: 'FritzisFuechse!'
  }
});
/*
var mailOptions = {
  from: 'apartmentradar@outlook.de',
  to: 'v.watson@hotmail.de',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
*/

async function pairArrays (x=[], y=[]){
  x = [...x,...y];
  return x;
}

async function isEqually (v=[], w=[]){
  v = w;
  return v;
}


var writeAWS = function (apartments) {
  return dynamo.put({
    TableName: 'aptradar',
    Item: {
      listingId: new Date().toString(),
      apts: apartments
    }
    }).promise()   
}

  var firstApts = [];
  var lastApts = [];
  async function appendApts (array=[], a=[], i){
    let newApts;
     if(i==0){
      firstApts = a;
      
     // console.log('this is firstApts: ',firstApts)
     }
     if(i==array.length-1){
        firstApts =[...firstApts,...a];  
     }
     else{
      firstApts =[...firstApts,...a]; 
     }
     return newApts = firstApts;
   }

  module.exports.getaptradar = async function (event, context) {
    let allApts;
    let newApts = [];
    var todayApts;
    //let firstApts;
    let p1 = new Promise (function(resolve, reject) {
      for (const i in sitelist){
        let extractor = sitelist[i][0];   
        request(sitelist[i][1])
          .then(({data}) => {
            allApts = extractor(data);
           newApts = appendApts(sitelist, allApts, i)
           //console.log('this is newApts: ',newApts);
           return lastApts = newApts;
          })
          .then(()=>{
           // console.log('this is firstApts: ',lastApts);
            if(i==sitelist.length-1){

             let oldApts= dynamo.scan({
                TableName: 'aptradar'
              }).promise();
              oldApts.then(response => {
               // console.log(allApts);
                // Figure out which jobs are new
                //console.log('response: ', response);
                let yesterdaysJobs = response.Items[0] ? response.Items[0].apts : [];
                
                todayApts= differenceWith(firstApts, yesterdaysJobs, isEqual);
                console.log('the new apartments are: ', todayApts);
                //Send Mail with newest apartments

                // Get the ID of yesterday's jobs which can now be deleted
                const jobsToDelete = response.Items[0] ? response.Items[0].listingId : null;
          
                // Delete old jobs
                
                if (jobsToDelete) {
                  return dynamo.delete({
                    TableName: 'aptradar',
                    Key: {
                      listingId: jobsToDelete
                    }
                  }).promise();
                } else return; 
              })
              .then(() => {
              return dynamo.put({
                TableName: 'aptradar',
                Item: {
                  listingId: new Date().toString(),
                  apts: firstApts
                }
                }).promise();  
              });
            }
          })
       }
    })
    p1.then(()=>{
      for(const i in todayApts){
        console.log('this is item', i, 'from todays apartments: ', todayApts[i])
        if(parseFloat(todayApts[i].rooms) >= 2.5 && parseFloat(todayApts[i].size) >=60 && parseFloat(todayApts[i].price) <= 1300){
          
          var mailOptions = {
            from: 'apartmentradar@outlook.de',
            to: 'v.watson@hotmail.de',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
          };
        }
      }
    })
  }
/*
  module.exports.getcorrectapts = async function (event, context) {
   
      for(const i in response){
        if(response.Items[i].Rooms >= 2.5 && response.Items[i].Size >=60 && response.Items[i].price <= 1300){
          
          var mailOptions = {
            from: 'apartmentradar@outlook.de',
            to: 'v.watson@hotmail.de',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
          };


          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 

        }
      }
    })
  }
*/


/*
module.exports.getaptradar = (event, context, callback) => {
  let newApts, allApts;
  request('https://inberlinwohnen.de/wohnungsfinder/')
  //request('https://www.mueller-merkle.de/angebote/?stadt=Berlin&zimmer=&wohnflaeche=0&preis_max=&objekttyp=&etage=&balkon_terrasse=&einbaukueche=#estates')
    .then(({data}) => {
      allApts = extractListingsFromHTML(data);
      return dynamo.scan({
        TableName: 'aptradar'
      }).promise();
    })
    .then(response => {
      // Figure out which jobs are new
      let yesterdaysJobs = response.Items[0] ? response.Items[0].apts : [];

      newApts= differenceWith(allApts, yesterdaysJobs, isEqual);

      // Get the ID of yesterday's jobs which can now be deleted
      const jobsToDelete = response.Items[0] ? response.Items[0].listingId : null;

      // Delete old jobs
      if (jobsToDelete) {
        return dynamo.delete({
          TableName: 'aptradar',
          Key: {
            listingId: jobsToDelete
          }
        }).promise();
      } else return;
    })
    .then(() => {
      // Save the list of today's jobs
      return dynamo.put({
        TableName: 'aptradar',
        Item: {
          listingId: new Date().toString(),
          apts: allApts
        }
      }).promise();
    })
    .then(() => {
      callback(null, { apts: newApts });
    })
    .catch(callback);
};*/
/*
module.exports.getaptradar = (event, context, callback) => {
  callback(null, 'Hello world');
}; 
*/
