const chai = require('chai');
let assert = chai.assert;
var expect = chai.expect;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
    test('getNum checker#1', function () {
        let result = convertHandler.getNum('5');
        assert.equal(result, 5);
    });

    test('getNum checker#2', function () {
        let result = convertHandler.getNum('3.4235');
        assert.approximately(result, 3.4235, 0.01);
    });

    test('getNum checker#3', function () {
        let result = convertHandler.getNum('5/6');
        assert.approximately(result, 0.83, 0.01);
    });

    test('getNum checker#4', function () {
        let result = convertHandler.getNum('5.345/6.52');
        assert.approximately(result, 0.81978, 0.01);
    });

    test('getNum checker#5', function () {
        assert.equal(convertHandler.getNum('5/5/5'), 'invalid number');
    });

    test('getNum checker#6', function () {
        assert.equal(convertHandler.getNum(''), 1);
    });

    test('getUnit checker#1', function () {
        const validUnit = ['gal', 'L', 'mi', 'km', 'lbs', 'kg', 'invalid unit'];
        const testUnit = ['GAL', 'l', 'mI', 'kM', 'lBs', 'kG', 'megacombocrap'];
        for (const [index, element] of Object.entries(validUnit)) {
            assert.equal(convertHandler.getUnit(testUnit[index]), element);
        };
    });

    test('getUnit checker#2', function () {
        assert.equal(convertHandler.getUnit('yada'), 'invalid unit');
    });

    test('getUnit checker#3', function () {
        const testPairSet = {
            'gal': 'L',
            'L': 'gal',
            'mi': 'km',
            'km': 'mi',
            'lbs': 'kg',
            'kg': 'lbs',
            'megacombocrap': 'invalid unit'
        };

        for (const [key, value] of Object.entries(testPairSet)) {
            assert.equal(convertHandler.getReturnUnit(key), value);
        };
    });

    test('getReturnUnit spellOut checker#1', function () {
        const testPairSet = {
            'gal': 'gallons',
            'L': 'litres',
            'mi': 'miles',
            'km': 'kilometers',
            'lbs': 'pounds',
            'kg': 'kilograms',
            'megacombocrap': undefined
        };

        for (const [key, value] of Object.entries(testPairSet)) {
            assert.equal(convertHandler.spellOutUnit(key), value);
        };
    });

    test('convert checker#1 gallons', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'gal',
            result: 3.78541,
            resultUnit: 'L'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });
    
    test('convert checker#2 litres', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'L',
            result: 0.26417,
            resultUnit: 'gal'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });

    test('convert checker#3 miles', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'mi',
            result: 1.60934,
            resultUnit: 'km'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });

    test('convert checker#4 kilometres', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'km',
            result: 0.62137,
            resultUnit: 'mi'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });

    test('convert checker#5 kg', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'kg',
            result: 2.20462,
            resultUnit: 'lbs'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });

    test('convert checker#6 lbs', function () {
        const tempObject = {
            initNum: 1,
            initUnit: 'lbs',
            result: 0.45359,
            resultUnit: 'kg'
        };
        
        let result = convertHandler.convert(tempObject.initNum, tempObject.initUnit);
        assert.equal(result[tempObject.initUnit], tempObject.initNum);
        assert.approximately(result[tempObject.resultUnit], tempObject.result, 0.01);
    });



    test('getString checker', function () {
        let result = convertHandler.getString('50/5.7', 'kG', '', '');
        assert.approximately(result.initNum, 50 / 5.7, 0.1);
        assert.equal(result.initUnit, 'kg');
        assert.approximately(result.returnNum, 19.2, 0.3);
        assert.equal(result.returnUnit, 'lbs');
        assert.equal(convertHandler.getString('5/5/5', 'yada'), 'invalid number and unit');
    });
});