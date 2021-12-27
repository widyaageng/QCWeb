function ConvertHandler() {
  
  this.getNum = function(input) {
    let regPattern = /^\d+(?:\.\d+(?:\/\d+(?:\.\d+|))*|\/(?:\d+\.\d+|\d+)|)$/
    let result = String(input).match(regPattern);
    
    if (input == null) {
      return 1;
    } else if (!result) {
      throw new Error("Invalid input number");
    } else {
      return (String(input).split('.')).length > 1 ? parseFloat(input) : parseInt(input);
    }
  };
  
  this.getUnit = function(input) {
    const unitSet = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];

    let result = unitSet.includes(input);
    
    if (result) {
      return input;
    } else {
      throw new Error("Invalid input unit");
    };
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    
    return result;
  };
  
}

module.exports = ConvertHandler;
