var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , Template = require( '../../src/builder/template' ).Template;

function Type( emitter ) {

  var depth = 0
    , name = ''
    , isDefinition = false;

  emitter.on( 'statement', function( code ) { 

    var parser = new Parser()
      , template = new Template( emitter );
    parser.process( code, emitter );

    if (!depth) {
      if (isDefinition) {
        emitter.emit( 'type definition', name );
      }
      else {
         emitter.emit( 'type declaration', code );
      }
    }
  } ); 

  emitter.on( 'open', function(code) {
    if (!depth) {
      var parser = new Parser()
        , template = new Template( emitter ); 
      parser.process( code, emitter );
      name = code;
    }
    ++depth;
    isDefinition = true;
  } );

  emitter.on( 'close', function( code ) {
    assert.notEqual( depth, 0 );
    --depth;
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



