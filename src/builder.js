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

  var result = '';

  emitter.on( 'type declaration', function( code ) {
    result += factory.createType( code );
  } );
  
  this.__defineGetter__( 'result', function() {
    return result;
  } );
}

module.exports.Builder = Builder;
module.exports.Forwarder = Forwarder;