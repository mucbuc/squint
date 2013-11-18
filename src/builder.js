function Builder( emitter, factory ) {
  
  var result = '';
  
  emitter.on( 'open', function( code ) {
    result = result.concat( factory.createOpen( code ) );
  } );

  emitter.on( 'close', function( code ) {
    result = result.concat( factory.createClose( code ) );
  } );

  emitter.on( 'statement', function( code ) {
    result = result.concat( factory.createStatement( code ) );
  } );
  
  this.__defineGetter__( 'result', function() {
    return result;
  } );
}

function Forwarder( emitter, factory ) {

  this.result = '';

  emitter.on( 'type declaration', function( code ) {
    this.result += factory.createType( code );
  } );

}

module.exports.Builder = Builder;
module.exports.Forwarder = Forwarder;