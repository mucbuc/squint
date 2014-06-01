var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Commenter( emitter ) {
  emitter.on( 'comment', function( token, code ) {
    var comment = code.match( /.*\n/ );
    emitter.emit( 'consume', comment[0] );
  } );
}

exports.Commenter = Commenter;
