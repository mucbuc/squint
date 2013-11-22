var events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Function(emitter) {

  emitter.on( 'open', parseDefinition );
  emitter.on( 'statement', parseDeclaration );

  function parseDefinition(code) {
    parse( code, 'function definition' );
  }

  function parseDeclaration(code) {
    parse( code, 'function declaration' );
  }

  function parse(code, doneEvent) {
    var parser = new Parser( {
          '(': 'function open', 
          ')': 'function close'
        } )
      , sub = new events.EventEmitter()
      , name = '';

    sub.once( 'function open', function(code) {
      parseTemplateParameters( code, emitter );
      name = code;
      sub.once( 'function close', function(parameters) { 
        emitter.emit( doneEvent, name + '(' + parameters + ')' );
      } );
    });
  
    parser.process( code, sub );
  }
}

exports.Function = Function; 