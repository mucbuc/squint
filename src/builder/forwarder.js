var Type = require( './type' ).Type; 

function Forwarder( emitter ) {

  var types = []
    , builder = new Type( emitter );

  emitter.on( 'type definition', function( type ) { 
    types.push( type );
  } );

  emitter.on( 'type declaration', function( type ) { 
    types.push( type );
  });

  emitter.on( 'end', function() { 
    process.nextTick( function() {
      emitter.emit( 'forward declare', types[0] );
    } );
  } );
}

module.exports.Forwarder = Forwarder;