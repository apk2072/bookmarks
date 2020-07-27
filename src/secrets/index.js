const aws = require('aws-sdk');

const kmsSecret = process.env.KMS_SECRET;
const ssmSecret = process.env.SSM_SECRET;
const userId =  process.env.SM_USER_ID;
const password =  process.env.SM_PASSWORD;


let decodedSecret;
let DecodedKMSSecret;

const kms = new aws.KMS();
const ssm = new aws.SSM();
const sm = new aws.SecretsManager();

exports.handler = async message => {
    console.log(message);
    
    let secretType = message.pathParameters.id

    console.log("Secret Type:", secretType);
    
    if(secretType == 'kms')
        decodedSecret = await decodeKMSSecret();
    else if (secretType == 'ssm')
        decodedSecret = await decodeSSMSecret();
    else if (secretType == 'sm') {
        var username = await decodeSMSecret(userId);
        var pass = await decodeSMSecret(password);
        decodedSecret = "User Id: " + username + ", password: " + pass
    }
    else
        decodedSecret = "Provide a valid secret type (kms, ssm or sm (secrets manager))";
    
    console.log(decodedSecret);
    
    const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify('Plain text secret(s): ' + decodedSecret)
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

async function decodeSMSecret(smkey) {
    console.log("SM Key:", smkey);
    const params = {
        SecretId: smkey
    };

    const result = await sm.getSecretValue(params).promise();
    return result.SecretString;
}