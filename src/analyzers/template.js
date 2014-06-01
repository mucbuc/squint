/*
  note: Template doesn't listen for 'end' event ==> this should generate an error since
        templates are always declarations or definitions
*/

var assert = require( 'assert' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Scoper = require( './scoper' ).Scoper
  , events = require( 'events' );

assert( typeof Scoper !== 'undefined' );

function Template( emitter ) {

  emitter.on( 'open', parse );
  emitter.on( 'statement', parse );

  function parse( code ) {
    var sub = Object.create( emitter.constructor.prototype )
      , scoper = new Scoper( sub, '<' )
      , tokenizer = new Tokenizer( sub, {
          'open scope': '<',
          'close scope': '>'
        } )
      , content = '';

    sub.on( 'close scope', function(code) {
      emitter.emit( 'template parameters', content + code.trim() );
    } );

    sub.on( 'end', function(code) {
      emitter.emit( 'template parameters', content + code.trim() );
    });

    tokenizer.process( code );
  }
}

exports.Template = Template;
