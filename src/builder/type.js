var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Type( emitter ) {

  var depth = 0
    , name = ''
    , isDefinition = false;

  emitter.on( 'statement', function( code ) { 
    
    parseTemplateParameters( code, emitter );
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
      parseTemplateParameters( code, emitter );
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

