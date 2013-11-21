var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , Template = require( '../../src/builder/template' ).Template;

function Type( emitter ) {

  var depth = 0
    , name = '';

  emitter.on( 'statement', function( code ) { 
    emitter.emit( 'type declaration', code ); 
  } ); 

  emitter.on( 'open', function(code) {
    if (!depth) {
      name = code;
    }
    ++depth;
  } );

  emitter.on( 'close', function( code ) {
    assert.notEqual( depth, 0 );

    if(!--depth) {
      emitter.once( 'statement', define );
    } 
    else {
      emitter.removeListener( 'statement', define );
    }
  
    function define() {
      emitter.emit( 'type definition', name );
    }
  } );
  
}

exports.Type = Type;

/* 

  emitter.on( 'statement', function( code ) {
  	process.nextTick( function() {
  		
  		var parser = new Parser()
  		  , template = new Template( emitter ); 

  		parser.process( code, emitter );
			emitter.emit( 'type declaration', code );
  	} );
  } );
*/



