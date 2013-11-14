function ForwardFactory() {
  
  this.createOpen = function( code ) {
    return '{';
  };
  
  this.createClose = function( code ) {
    return '}';
  };
  
  this.createStatement = function( code ) {
    return ';';
  };

};


function Factory() {
  
  
}

Factory.prototype.createOpen = function() {

}


module.exports.Factory = Factory;