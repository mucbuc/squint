
var events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , Template = require( '../../src/builder/template' ).Template;

function Type( emitter ) {

  emitter.on( 'open', function( code ) {
  	process.nextTick( function() {
  		emitter.emit( 'type definition', code );
  	} );
  } );
  
  emitter.on( 'statement', function( code ) {
  	process.nextTick( function() {
  		
  		var parser = new Parser()
  		  , template = new Template( emitter ); 

  		parser.process( code, emitter );
			emitter.emit( 'type declaration', code );
  	} );
  } );
}


exports.Type = Type;