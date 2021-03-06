const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    test('10L good input convert', function () {
        const tempDict = {
            "reqParam": '?input=10L',
            "initNum": 10,
            "initUnit": "L",
            "returnNum": 2.64172,
            "returnUnit": "gal",
            "string": "10 litres converts to 2.64172 gallons"
        };

        chai
            .request(server)
            .get(`/api/convert${tempDict.reqParam}`)
            .end(function (err, res) {
                assert.equal(res.body.initNum, tempDict.initNum);
                assert.equal(res.body.initUnit, tempDict.initUnit);
                assert.equal(res.body.returnNum, tempDict.returnNum);
                assert.equal(res.body.returnUnit, tempDict.returnUnit);
                assert.equal(res.body.string, tempDict.string);
            });
    });

    test('32g bad unit convert', function () {
        const tempDict = {
            "reqParam": '?input=32g',
            "message": 'invalid unit'
        };

        chai
            .request(server)
            .get(`/api/convert${tempDict.reqParam}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body, tempDict.message);
            });
    });

    test('3/7.2/4kg bad number convert', function () {
        const tempDict = {
            "reqParam": '?input=3/7.2/4kg ',
            "message": 'invalid number'
        };

        chai
            .request(server)
            .get(`/api/convert${tempDict.reqParam}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body, tempDict.message);
            });
    });

    test('3/7.2/4kilomegagram bad number & input convert', function () {
        const tempDict = {
            "reqParam": '?input=3/7.2/4kilomegagram',
            "message": 'invalid number and unit'
        };

        chai
            .request(server)
            .get(`/api/convert${tempDict.reqParam}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body, tempDict.message);
            });
    });

    test('kg no number conver', function () {
        const tempDict = {
            "reqParam": '?input=kg',
            "initNum": 1,
            "initUnit": "kg",
            "returnNum": 2.20462,
            "returnUnit": "lbs",
            "string": "1 kilograms converts to 2.20462 pounds"
        };

        chai
            .request(server)
            .get(`/api/convert${tempDict.reqParam}`)
            .end(function (err, res) {
                assert.equal(res.body.initNum, tempDict.initNum);
                assert.equal(res.body.initUnit, tempDict.initUnit);
                assert.equal(res.body.returnNum, tempDict.returnNum);
                assert.equal(res.body.returnUnit, tempDict.returnUnit);
                assert.equal(res.body.string, tempDict.string);
            });
    });
});
