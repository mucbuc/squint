var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Type( emitter ) {

  var depth = 0
    , name = ''
    , isDefinition = false
    , definition = '';

  emitter.on( 'statement', function( code ) { 
    
    parseTemplateParameters( code, emitter );
    if (!depth) {
      if (isDefinition) {
        emitter.emit( 'type definition', name );
        if (definition.length) {
          emitter.emit( 'type implementation', definition );
        }
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
  } );

  emitter.on( 'close', function( code ) {
    assert.notEqual( depth, 0 );
    console.log( 'close', code );
    definition = code;

    if (!--depth) {
      isDefinition = true;
    }
  } );
  
}

exports.Type = Type;

