function Factory() {

}

Factory.prototype = {
	forwardType: function(code) {
      return code + ';';
    }, 
  	declareClose: function() {
      return '};';    
    }, 
  memberDeclare: function() {
      return ';';
    }
};


module.exports.Factory = Factory;