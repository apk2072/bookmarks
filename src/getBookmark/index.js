const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB()

exports.handler = async message => {
  console.log(message);
  let bookmarkId = message.pathParameters.id
  let params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: { S: bookmarkId }
    }
  };

  console.log(`Getting bookmark ${bookmarkId} from table ${process.env.TABLE_NAME}`);
  let results = await dynamodb.getItem(params).promise()
  console.log(`Done: ${JSON.stringify(results)}`);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(results.Item)
  };
}
