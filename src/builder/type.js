var assert = require( 'assert' )
  , events = require( 'events' )
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Type( emitter ) {

  var depth = 0
    , name = ''
    , isDefinition = false
    , definition = '';

  emitter.on( 'statement', function( code ) { 
    if (!depth) {
      if (isDefinition) {
        emitter.emit( 'type definition', name );
        if (definition.length) {
          emitter.emit( 'type implementation', definition );
        }
      }
      else {
        parseTemplateParameters( code, emitter );
        emitter.emit( 'type declaration', code );
      }

      reset();
    }
    else {
      definition += code + ';';
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
    definition += code;

    if (!--depth) {
      isDefinition = true;
    }
  } );

  function reset() {
    isDefinition = false;
    definition = '';
  }
  
}

exports.Type = Type;

