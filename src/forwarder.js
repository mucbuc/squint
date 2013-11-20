function Forwarder( emitter ) {

  var types = [];

  emitter.on( 'type declaration', function( code ) {
    types.push( code );
  } );
  
  // TODO: factor out commonalty into builder prototype(maybe function)
  this.buildProduct = function( factory, done ) {
      
    if (!types.length) {
      done( '' );
    }
    else {
      var result = '';
      types.forEach( function( type, index ) {
        result += type + factory.memberDeclare();
      
        if (index == types.length - 1) {
          done( result );
        }
      } ); 
    }
  };
}

module.exports.Forwarder = Forwarder;