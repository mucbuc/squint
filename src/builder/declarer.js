var assert = new require( 'assert' )
  , Type = new require( './type' ).Type;

function Declarer( emitter ) {
  
  var builder = new Type( emitter )
    , types = [];

  emitter.on( 'type declaration', appendType );
  emitter.on( 'type definition', appendType );

  emitter.on( 'end', function() {
    if (types.length) {
      emitter.emit( 'type decalartions', types[0] );
    }
  });

  function appendType(code) {
    types.push( code );
  }
}

module.exports.Declarer = Declarer;

/*
var name = ''
    , members = [];

  emitter.once( 'open', function() {
    emitter.on( 'statement', appendMember ); 
  } ); 

  emitter.once( 'close', function() {
    emitter.removeListener( 'statement', appendMember ); 
  } );

  emitter.on( 'type declaration', function( code ) {
    name = code;
  } );
  
  this.buildProduct = function( factory, done ) {

    var result = name + factory.declareOpen();
    
    if (!members.length) {
      close();
    }
    else {
      members.forEach( function( member, index ) {
        result += member + factory.memberDeclare();
        if (index == members.length - 1) {
          close();
        }
      } );
    }

    function close() {
      done( result + factory.declareClose() );
    }
  };

  function appendMember(code) {
    members.push( code.trim() );
  }*/