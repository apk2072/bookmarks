const aws = require('aws-sdk');

const kmsSecret = process.env.KMS_SECRET;
const ssmSecret = process.env.SSM_SECRET;

let decodedSecret;

let DecodedKMSSecret;

const kms = new aws.KMS();
const ssm = new aws.SSM();

exports.handler = async message => {
    console.log(message);
    
    let secretType = message.pathParameters.id
    //const secretType = 'ssm or kms';
    
    console.log("Secret Type:", secretType);
    
    if(secretType == 'kms')
        decodedSecret = await decodeKMSSecret();
    else if (secretType == 'ssm')
        decodedSecret = await decodeSSMSecret();
    else
        decodedSecret = "Provide a valid secret type (kms or ssm)";
    
    console.log(decodedSecret);
    
    const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify('Plain text secret: ' + decodedSecret)
    };
    return response;
};

async function decodeKMSSecret() {
    if (DecodedKMSSecret) {
        return DecodedKMSSecret;
    }

    const params = {
      CiphertextBlob: Buffer.from(kmsSecret, 'base64')
    };

    const data = await kms.decrypt(params).promise();
    DecodedKMSSecret = data.Plaintext.toString('utf-8');

    return DecodedKMSSecret;
}

async function decodeSSMSecret() {
    const params = {
        Name: ssmSecret,
        WithDecryption: true
    };

    const result = await ssm.getParameter(params).promise();
    return result.Parameter.Value
}