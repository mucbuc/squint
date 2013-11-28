var events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Function(emitter) {

  emitter.on( 'open', parseDefinition );
  emitter.on( 'statement', parseDeclaration );

  function parseDefinition(code) {
    parse( code, 'define function' );
  }

  function parseDeclaration(code) {
    parse( code, 'declare function' );
  }

  function parse(code, doneEvent) {
    var parser = new Parser( {
          '(': 'open function', 
          ')': 'close function'
        } )
      , sub = new events.EventEmitter()
      , name = '';

    sub.once( 'open function', function(code) {
      parseTemplateParameters( code, emitter );
      name = code;
      sub.once( 'close function', function(parameters) { 
        emitter.emit( doneEvent, name + '(' + parameters + ')' );
      } );
    });
  
    parser.process( code, sub );
  }
}

exports.Function = Function; 