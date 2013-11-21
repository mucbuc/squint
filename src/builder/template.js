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
          '<': 'template open', 
          '>': 'template close' 
        } )
      , sub = new events.EventEmitter();

    sub.once( 'template open', function( code ) {
      sub.once( 'template close', function( code ) {
        emitter.emit( 'template parameters', code ); 
      } );
    } );

    parser.process( code, sub );
  }
}

exports.Template = Template; 