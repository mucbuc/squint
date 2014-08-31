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
  emitter.on( 'end', parse );

  function parse( response ) {
    var sub = Object.create( emitter.constructor.prototype )
      , code = response.lhs
      , scoper = new Scoper( sub )
      , rules = {
          'open scope': '<',
          'close scope': '>'
        };

    sub.on( 'close scope', function(code) {
      emitter.emit( 'template parameters', code );
    } );

    sub.on( 'end', function(code) {
      emitter.emit( 'template parameters', code );
    });

    fluke.splitAll( code, function( type, response) {
          sub.emit( type, response.lhs );
        }
      , rules );
  }
}

exports.Template = Template;
