/* 
  note: Template doesn't listen for 'end' event ==> this should generate an error since 
        templates are always declarations or definitions
*/

var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper
  , events = require( 'events' );

assert( typeof Scoper !== 'undefined' );

function Template( emitter ) {

  Scoper.call( this, emitter, '<' );

  emitter.on( 'close scope', function(code) {
    emitter.emit( 'template parameters', code ); 
  } );
}

Template.prototype = new Scoper(); 

exports.Template = Template;