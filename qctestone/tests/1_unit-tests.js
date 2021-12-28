const chai = require('chai');
let assert = chai.assert;
var expect = chai.expect;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
    suite('Non-json test', function () {
        test('getNum checker', function () {
            let result = convertHandler.getNum('5/6');
            assert.approximately(result, 0.83, 0.01);
            expect(() => convertHandler.getNum('5/5/5')).to.throw(/^invalid number$/);
        });

        test('getUnit checker', function () {
            let result = convertHandler.getUnit('LbS');
            assert.equal(result, 'lbs');
            expect(() => convertHandler.getUnit('yada')).to.throw(/^invalid unit$/);
        });

        test('getReturnUnit checker', function () {
            let result = convertHandler.getReturnUnit('mi');
            assert.equal(result, 'km');
            expect(() => convertHandler.getReturnUnit('yada')).to.throw(/^invalid unit$/);
        });

        test('spellOutUnit checker', function () {
            const unitPairSet = {
                'gal': 'gallons',
                'L': 'litres',
                'mi': 'miles',
                'km': 'kilometers',
                'lbs': 'pounds',
                'kg': 'kilograms'
            };

            for (const [key,val] of Object.entries(unitPairSet)) {
                assert.equal(convertHandler.spellOutUnit(key), val);
            }; 
        });

        test('getString checker', function () {
            let result = convertHandler.getString('50/5.7', 'kG', '', '');
            assert.approximately(result.initNum, 50/5.7, 0.1);
            assert.equal(result.initUnit, 'kilograms');
            assert.approximately(result.returnNum, 19.2, 0.3);
            assert.equal(result.returnUnit, 'pounds');
            expect(() => convertHandler.getString('5/5/5', 'yada')).to.throw(
                /^invalid number and unit$/
            );
        });

    });

});