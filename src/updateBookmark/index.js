const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB()

exports.handler = async message => {
  console.log(message);

  if (message.body) {
    let bookmarkId = message.pathParameters.id
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

    console.log(`Updating bookmark ${bookmarkId} in table ${process.env.TABLE_NAME}`);
    await dynamodb.putItem(params).promise()
    console.log(`Bookmark is updated with new data`);
  }

  return {
    statusCode: 204,
    headers: {},
    body: JSON.stringify({})
  };
}
