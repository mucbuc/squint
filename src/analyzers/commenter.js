var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Commenter( emitter ) {
  emitter.on( 'comment line', function( token, code ) {
    var comment = code.match( /.*\n/ );
    emitter.emit( 'consume', comment[0] );
  } );

  emitter.on( 'comment block', function( token, code ) {
    var comment = code.match( /.*\*\// );
    emitter.emit( 'consume', comment[0] );
  } );
}

exports.Commenter = Commenter;
