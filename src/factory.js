function Factory() {

}

Factory.prototype = {
	declareOpen: function() {
      return '{';
    }, 
  declareClose: function() {
      return '};';    
    }, 
  memberDeclare: function() {
      return ';';
    }
};


module.exports.Factory = Factory;