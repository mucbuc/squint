var events = require( 'events' )
  , Parser = require( '../parser' ).Parser
  , parseTemplateParameters = require( '../../src/builder/template' ).parseTemplateParameters;

function Function(emitter) {

  emitter.on( 'open', parse );
  emitter.on( 'statement', parse );

  function parse(code) {
    var parser = new Parser( {
          '(': 'function open', 
          ')': 'function close'
        } )
      , sub = new events.EventEmitter()
      , resultType = ''
      , name = '';

    sub.once( 'function open', function(code) {
      parseTemplateParameters( code, emitter );
      name = code;
      sub.once( 'function close', function(parameters) { 
        emitter.emit( 'function declaration', resultType + ' ' + name + '(' + parameters + ')' );
      } );
    });
  
    parser.process( code, sub );
  }
}

exports.Function = Function; 