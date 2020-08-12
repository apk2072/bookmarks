# A simple Serverless App using AWS SAM

This app is to create a simple serverless based app which will cover typical crud (create, read, update and delete) operations.

**Services used:**

- **Amazon API Gateway:** It will have GET, POST, UPDATE and DELETE operations.
- **AWS Lambda:** Total 5 lambda functions (create, update, get, delete, list) used.
- **Amazon DynamoDB:** A table to store the bookmarks.
- **AWS X-Ray:** For monitoring and troubleshooting.
- **KMS, AWS Systems Manager and AWS Secrets Manager:** To handle secrets.

The Bookmark application is built based on Serverless
Application Model (SAM) framework, you can find the anatomy of the architecture in the **template.yaml** file.

**Initial setup**

You will need AWS SAM setup before proceed. Visit the page https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html for settings.

Clone the source code.

```
git clone https://github.com/apk2072/bookmarks.git
```

```
cd bookmarks
```

_Note: before you build and deploy the project, go to `/src/createBookmark` folder and run the following command, there is an sdk dependency:_

```
cd src/createBookmark
npm i aws-xray-sdk
```

Change the working folder to /bookamarks and run the sam deploy command.

```
cd ../..
```

_Note: If SAM CLI is not installed, you need to setup the SAM before proceeding further. You will find the instructions here on how to install the SAM CLI - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html_

```
sam deploy --guided
```

Enter the names wherever there are no defaults, otherwise accept all default values.

---
**How to use the APIs**

Set a `API_END_POINT` with the following command.

```
export API_END_POINT=api_gateway_url

# e.g. export API_END_POINT=https://zzzxxxyyyhsg.execute-api.us-east-2.amazonaws.com/Dev

```

**Create a Bookmark:**

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"id": "uid001", "url": "https://www.aws.training/", "name": "AWS Training Page", "description": "This site carries tons of free AWS training courses"}' \
${API_END_POINT}/bookmarks
```

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"id": "uid002", "url": "https://apod.nasa.gov/apod/astropix.html", "name": "Astronomy Picture of the Day", "description": "Each day a different image."}' \
${API_END_POINT}/bookmarks
```

**List all Bookmarks:**

```
curl ${API_END_POINT}/bookmarks
```

**Get a Bookmark:**

```
curl ${API_END_POINT}/bookmarks/uid001
```

**Update a Bookmark:**

```
curl --header "Content-Type: application/json" \
--request PUT \
--data '{"id": "uid001", "url": "https://www.aws.training/", "name": "AWS Training Page and free digital courses", "description": "This site carries lots of useful courses on various AWS services"}' \
${API_END_POINT}/bookmarks/uid001
```

**Delete a Bookmark:**

```
curl --request DELETE ${API_END_POINT}/bookmarks/uid001
```

---
**Load test script**

```
for i in $(seq 2 200); do
    echo "Record no - $i" 
    export id=uid-$i
    curl --header "Content-Type: application/json" --request POST --data '{"id": "'$id'", "url": "https://en.wikipedia.org/'$i'", "name": "Wiki page '$i'", "description": "This is wiki page for non-english readers"}' ${API_END_POINT}/bookmarks; 
    sleep 1;
done
```

---

***Secrets***

1. **Managing secretes using AWS Key Management Service (KMS)**

    This section will show how to encrypt your Lambda environment variables by KMS and store and retrieve secrets (e.g. database credentials) by using AWS Systems Manager Parameter Store (SSM).

    
    **Encrypting environment variables using KMS:**
    Open the AWS management console, go to Key Management Service (KMS) and create a key (customer managed). Run the following command to generate the encrypted value for your lambda environment variable.

    ```
    aws kms encrypt --key-id <REPLACE_WITH_KEY_ID_JUST_GENERATED> \
                    --plaintext "value of your lambda environment variable" \
                    --query CiphertextBlob \
                    --output text

    ```

    The output of this command is the encrypted version of the plaintext value. Copy this text and update the value of KMS_SECRETE value in the environmental field section of xxxx-getSecret lambda function.
    
    To test the value, run the following command.

    ```
    curl ${API_END_POINT}/secret/kms
    ```

1. **Manage secrets using AWS Systems Manager Parameter Store**

    This feature is mainly useful when your lambda is accessing private resources such as Amazon RDS. You can create secrets and access those programmatically.

    Run the following command to create an entry for your secret in Parameter Store.

    ```
    aws ssm put-parameter --name /db/secret \
                          --value 'Pas$word!' \
                          --type SecureString

    ``` 

    Navigate to Systems Manager console and check for the `/db/secret` in Parameter Store section.

    Next, update the SSM_SECRET environment variable with `/db/secret` in xxxx-getSecret lambda function. To test for the secret, run the following command:

    ```
    curl ${API_END_POINT}/secret/ssm
    ```

1. **Manager secrets using AWS Secrets Manager**

    This feature is mainly useful when your lambda is accessing private resources such as Amazon RDS credentials. You can create secrets and access those programmatically.

    Run the following command to create an entry for your secrets using AWS Secrets Manager.

    ```
    aws secretsmanager create-secret --name dbUserId --secret-string "scott"
    aws secretsmanager create-secret --name password --secret-string "tiger"   
    ``` 

    Navigate to Secrets Manager console and check for two secrets, `dbUserId` and `password`.

    Retrieve the values for these secrets by running the following command.

    ```
    curl ${API_END_POINT}/secret/sm
    ```

    _Note: Look into xxxx-getSecrete lambda function for the relevant code on how to retrieve secrets for KMS, SSM and Secrets Manager_

    ---
**Load testing**

We will use *artillery* tool for the load testing. You can visit artillery.io for more details. Run the following commands for sending the load. With the combination of faker libraries and artillery.io, you can effortlessly start loading the data.

Install faker library by running following command:

```
cd test
```

```
npm i faker
```

Go to /test folder, open `simple-post.yaml` file and update the target url with your API Gateway endpoint url. Example:

`target: 'https://l7svtaxasxxx.execute-api.us-east-2.amazonaws.com/Stage'`

Change the `duration` and `arrivalRate` numbers based on your need and run the following command.

```
artillery run simple-post.yaml
```

Check the DynamoDB table for the new data.

---
***Appendix***

- _Faker API documentation - https://www.npmjs.com/package/faker_
- _Artillery testing tool - https://artillery.io_



