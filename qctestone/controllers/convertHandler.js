function ConvertHandler() {
  
  this.getNum = function(input) {
    let regPattern = /^\d+(?:\.\d+(?:\/\d+(?:\.\d+|))*|\/(?:\d+\.\d+|\d+)|)$/
    let result = String(input).match(regPattern);
    
    if (input == null || input === '') {
      return 1;
    } else if (!result) {
      return 'invalid number';
    } else {
      let terms = String(input).split('/');

      if (terms.length > 1) {
        return parseFloat(terms[0]/terms[1]);
      } else {
        return parseFloat(terms[0]);
      };
    };
  };
  
  this.getUnit = function(input) {
    const unitSet = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];

    let result = unitSet.includes(input.toLowerCase());
    
    if (result) {
      return input === 'l' || input === 'L' ? 'L' : input.toLowerCase();
    } else {
      return 'invalid unit';
    };
  };

  this.getReturnUnit = function(unit) {
    const unitPairSet = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    }

    let result = Object.keys(unitPairSet).includes(unit);
    
    if (result) {
      return unitPairSet[unit];
    } else {
      return 'invalid unit';
    };
  };

  this.spellOutUnit = function(unit) {
    const unitPairSet = {
      'gal': 'gallons',
      'L': 'litres',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    }
    
    return unitPairSet[unit];

  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    switch(initUnit) {
      case 'L':
        return {
          'L': initNum,
          'gal': initNum/galToL
        };
      case 'gal':
        return {
          'L': initNum*galToL,
          'gal': initNum
        };
      case 'kg':
        return {
          'kg': initNum,
          'lbs': initNum/lbsToKg
        };
      case 'lbs':
        return {
          'kg': initNum*lbsToKg,
          'lbs': initNum
        };
      case 'km':
        return {
          'km': initNum,
          'mi': initNum/miToKm
        };
      case 'mi':
        return {
          'km': initNum*miToKm,
          'mi': initNum
        };
      default:
        return 'invalid unit';
    }
  };
  
  this.getString = function(initNum, initUnit, res, returnUnit) {
    let result = {
      getNumError: '',
      getUnitError: ''
    };


    result.initNum = this.getNum(initNum);
    result.getNumError = result.initNum === 'invalid number';

    result.initUnit = this.getUnit(initUnit);
    result.returnUnit = this.getReturnUnit(result.initUnit);
    result.getUnitError =  result.returnUnit === 'invalid unit';

    if (!result.getNumError && !result.getUnitError) {
      result.outNumber = this.convert(result.initNum, result.initUnit)[result.returnUnit];
    } else if (result.getNumError && result.getUnitError) {
      return 'invalid number and unit';
    } else if (result.getNumError) {
      return 'invalid number';
    } else {
      return 'invalid unit';
    }

    let initNumber = parseFloat(result.initNum.toFixed(5));
    let returnNumber = parseFloat(result.outNumber.toFixed(5));
    
    return {
      initNum: initNumber,
      initUnit: result.initUnit,
      returnNum: returnNumber,
      returnUnit: result.returnUnit,
      string: `${initNumber} ${this.spellOutUnit(result.initUnit)} converts to ${returnNumber} ${this.spellOutUnit(result.returnUnit)}`
    };
  };
  
}

module.exports = ConvertHandler;
