# A simple Serverless demo using AWS SAM

This app is to create a simple serverless based app which will cover typical crud (create, read, update and delete) operations.

**Services used:**

- **Amazon API Gateway:** It will have GET, POST, UPDATE and DELETE operations.
- **AWS Lambda:** Total 5 lambda functions (create, update, get, delete, list) used.
- **Amazon DynamoDB:** A table to store the bookmarks.
- **AWS X-Ray:** For monitoring and troubleshooting.
- **KMS and Systems Manager:** To handle secrets.

The Bookmark application is built based on Serverless
Application Model (SAM) framework, you can find the anatomy of the architecture in the template.yaml file.

**Initial setup**

You will need AWS SAM setup before proceed. Visit the page https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html for settings.

Clone the source code and run the below command.

_Note: before you build and deploy the project, go to /createBookmark folder and run the following command, there is a dependency:_

`npm i aws-xray-sdk`

```
sam deploy --guided
```




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
