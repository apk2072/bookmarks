var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
var dynamodb = AWSXRay.captureAWSClient(new AWS.DynamoDB());

exports.handler = async message => {
  console.log(message);
  
  //Fail the messages randomly to see those errors in X-Ray tracing. It's for testing only.
  if(Math.random() < 0.2)
    throw new Error('An unknown error occurred');

  //Can you throw a different response code other than 200?
  
  //Timeout failures about 10%
  if(Math.random() < 0.15) {
     await new Promise(resolve => setTimeout(resolve, 10000));
  };
  
  if (message.body) {
    let bookmark = JSON.parse(message.body);
    let params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: bookmark.id },
        url: { S: bookmark.url },
        name: { S: bookmark.name },
        description: { S: bookmark.description }
      }
    };
    
    var seg = AWSXRay.getSegment();
    seg.addAnnotation('uuid', bookmark.id);
    seg.addAnnotation('url', bookmark.url);
    
    seg.addMetadata('url', bookmark.url);
    seg.addMetadata('name', bookmark.name);

    console.log(`Adding bookmark to table ${process.env.TABLE_NAME}`);
    await dynamodb.putItem(params).promise()
    console.log(`New bookmark added to the inventory`);
  }

  return {};
}
