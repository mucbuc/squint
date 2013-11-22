var Type = require( './type' ).Type; 

function Forwarder( emitter ) {

  var types = []
    , builder = new Type( emitter );

  emitter.on( 'type definition', function( type ) { 
    console.log( 'type def', type );
    types.push( type );
  } );

  emitter.on( 'type declaration', function( type ) { 
    console.log( 'type decl', type );
    types.push( type );
  });

  emitter.on( 'end', function() { 
    process.nextTick( function() {
      emitter.emit( 'forward declare', types[0] );
    } );
  } );

/*
  emitter.on( 'open', function(code) {
    emitter.once( 'close', function() {
      emitter.once( 'statement', function() { 
        console.log( 'type', code );
      } );
    } );
  } ); 
*/
  //emitter.on( 'end', append );

  
    // process.nextTick( function() {
    //   if (types.length) {
    //     emitter.emit( 'forward declare', types.join( ';' )  );
    //   }
    // } );
  
  function append( code ) {

    console.log( 'append', code );

    types.push( code );
  }
}

module.exports.Forwarder = Forwarder;