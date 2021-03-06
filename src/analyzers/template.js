/*
  note: Template doesn't listen for 'end' event ==> this should generate an error since
        templates are always declarations or definitions
*/

var assert = require( 'assert' )
  , fluke = require( 'flukejs' )
  , Scoper = require( './scoper' ).Scoper
  , events = require( 'events' );

assert( typeof Scoper !== 'undefined' );

function Template( emitter ) {

  emitter.on( 'open', parse );
  emitter.on( 'statement', parse );

  function parse( response ) {
    var sub = Object.create( emitter.constructor.prototype )
      , scoper = new Scoper( sub, { 'open': '<', 'close': '>' } );

    sub.on( 'close scope', function(code) {
      emitter.emit( 'template parameters', code );
    } );

    sub.on( 'end', function( response ) {
      emitter.emit( 'template parameters', response.lhs );
    });

    fluke.splitAll( response.lhs, function( type, response) {
          sub.emit( type, response );
        }
      , {
          'open': '<',
          'close': '>'
      } );
  }
}

exports.Template = Template;
