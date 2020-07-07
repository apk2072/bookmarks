# A simple Serverless demo with crud operations

This app is to create a simple serverless based app which will cover crud operations.

**Services used:**

- API Gateway: It will have GET, POST, UPDATE abd DELETE operations.
- Lambda: 5 lambda functions (create, update, get, delete, list).
- DynamoDB: A table to store the bookmarks

The this application is built based on Serverless
Application Model (SAM) is defined, you can find the anatomy of the architecture in template.yaml file.


**How to use the APIs**

Set a `API_END_POINT` with the following command.

```
export API_END_POINT=api_gateway_url

# e.g. export API_END_POINT=https://zzzxxxyyyhsg.execute-api.us-east-2.amazonaws.com/Dev

```

**Create a bookmark:**
```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"id": "uid001", "url": "https://www.aws.training/", "name": "AWS Training Page", "description": "This site carries tons of free aws training courses"}' \
${API_END_POINT}/bookmarks
```

```
curl --header "Content-Type: application/json" \
--request POST \
--data '{"id": "uid002", "url": "https://apod.nasa.gov/apod/astropix.html", "name": "Astronomy Picture of the Day", "description": "Each day a different image."}' \
${API_END_POINT}/bookmarks
```

**List Bookmarks:**

```
curl ${API_END_POINT}/bookmarks
```

**Get a bookmark:**

```
curl ${API_END_POINT}/bookmarks/uid001
```

**Update a bookmark:**

```
curl --header "Content-Type: application/json" \
--request PUT \
--data '{"id": "uid001", "url": "https://www.aws.training/", "name": "AWS Training Page and free digital courses", "description": "This site carries lots of useful courses on various AWS services"}' \
${API_END_POINT}/bookmarks/uid001
```

**Delete a bookmark:**

```
curl --request DELETE ${API_END_POINT}/bookmarks/uid001
```
