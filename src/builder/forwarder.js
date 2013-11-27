var Type = require( './type' ).Type
  , events = require( 'events' ); 

function Forwarder( emitter ) {

  var types = []
    , builder = new Type( emitter );

  emitter.on( 'type definition', function( type ) { 
    types.push( type );
  } );

  emitter.on( 'type declaration', function( type ) { 
    types.push( type );
  });

  emitter.once( 'end', function() { 
    process.nextTick( function() {
      emitter.emit( 'forward declare', types );
    } );
  } );
}

/*
function makeForwardDeclaration( code, done ) {
  var emitter = new events.EventsEmitter()
    , builder = new Forwarder( emitter );

  emitter.on( 'forward declare', function( code ) {
    done( code );
  } );
  parser.process( 'struct dummy{ void init(); };', emitter );
}

exports.makeForwardDeclaration = makeForwardDeclaration;*/

exports.Forwarder = Forwarder;