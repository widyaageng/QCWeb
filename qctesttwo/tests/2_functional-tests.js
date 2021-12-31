const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('POST with every field', function () {

    });

    test('POST with only required fields', function () {

    });

    test('POST with missing required fields', function () {

    });

    test('GET to view issues', function () {

    });

    test('GET to view issues with one filter', function () {

    });

    test('GET to view issues with multiple filters', function () {

    });

    test('PUT with one field', function () {

    });

    test('PUT with multiple fields', function () {

    });

    test('PUT with missing id', function () {

    });

    test('PUT with no fields to update', function () {

    });

    test('PUT with invalid id', function () {

    });

    test('DELETE an issue', function () {

    });

    test('DELETE with invalid id', function () {

    });

    test('DELETE with missing id', function () {

    });
});
