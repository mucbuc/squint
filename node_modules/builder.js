function Builder( emitter, factory ) {
  
  var document = '';
  
  String.call( this );
  
  emitter.on( 'open', function( code ) {
    document = document.concat( factory.createOpen( code ) );
  } );

  emitter.on( 'close', function( code ) {
    document = document.concat( factory.createClose( code ) );
  } );

  emitter.on( 'statement', function( code ) {
    document = document.concat( factory.createStatement( code ) );
  } );
  
  this.__defineGetter__( 'document', function() {
    return document;
  } );
}

Builder.prototype = new String();

module.exports.Builder = Builder;