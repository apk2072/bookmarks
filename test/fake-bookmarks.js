'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const uid = `${Faker.name.firstName()}` ; //Faker.String.base64(4);
  //const url = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
  const url = Faker.internet.url();
  //const name = Faker.internet.domain_word();
  const name = `${Faker.name.lastName()}`;
  //const url = `${Faker.name.firstName()} ${Faker.name.lastName()}`
  const description = `${Faker.hacker.phrase()}`;
  // add variables to virtual user's context:
  userContext.vars.uid = uid;
  userContext.vars.name = name;
  userContext.vars.url = url;
  userContext.vars.description = description;
  // continue with executing the scenario:
  return done();
}
