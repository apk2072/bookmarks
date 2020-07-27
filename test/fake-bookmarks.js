'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  //const uid = `${Faker.random.uid()}` ; //Faker.String.base64(4);
  let uuid = Faker.random.uuid();
  //const url = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
  const url = Faker.internet.url();
  //const name = Faker.internet.domain_word();
  const name = Faker.lorem.words();
  //const url = `${Faker.name.firstName()} ${Faker.name.lastName()}`
  const description = Faker.lorem.text();
  // add variables to virtual user's context:
  userContext.vars.uid = uuid;
  userContext.vars.name = name;
  userContext.vars.url = url;
  userContext.vars.description = description;
  // continue with executing the scenario:
  return done();
}
