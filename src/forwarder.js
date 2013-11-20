function Forwarder( emitter ) {

  var types = [];

  emitter.on( 'type declaration', function( code ) {
    types.push( code );
  } );
  
  this.buildProduct = function( factory, done ) {
    var result = '';
    types.forEach( function( type, index ) {
      result += type + factory.memberDeclare();
    
      if (index == types.length - 1) {
        done( result );
      }
    } ); 
  };
}

module.exports.Forwarder = Forwarder;