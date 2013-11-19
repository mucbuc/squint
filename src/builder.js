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

function Declarer( emitter, factory ) {

  var result = ''
    , members = ''; 

  emitter.once( 'open', function() {
    emitter.on( 'statement', appendMember ); 
  } ); 

  emitter.once( 'close', function() {
    emitter.removeListener( 'statement', appendMember ); 
  } );

  emitter.on( 'type declaration', function( code ) {
    result += code + '{';
  } );
  
  this.__defineGetter__( 'result', function() {
    return  result + members + '};';  ;
  } );

  function appendMember(code) {
    members += code.trim() + ';'; 
  }

}


module.exports.Builder = Builder;
module.exports.Forwarder = Forwarder;
module.exports.Declarer = Declarer;