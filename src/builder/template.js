/* 
  note: Template doesn't listen for 'end' event ==> this should generate an error since 
        templates are always declarations or definitions
*/

var Parser = require( '../parser' ).Parser
  , events = require( 'events' );

function Template( emitter ) {

  emitter.on( 'open', parse );
  emitter.on( 'statement', parse );
  emitter.on( 'end', parse );

  function parse( code ) {
    
    var parser = new Parser( { 
          '<': 'open template', 
          '>': 'close template' 
        } )
      , sub = new events.EventEmitter();

    sub.once( 'open template', function( code ) {
      sub.once( 'close template', function( code ) {
        emitter.emit( 'template parameters', code ); 
      } );
    } );

    parser.process( code, sub );
  }
}

function parseTemplateParameters(code, emitter) {
  var parser = new Parser()
    , template = new Template( emitter );
  parser.process( code, emitter );
}

exports.Template = Template;
exports.parseTemplateParameters = parseTemplateParameters;