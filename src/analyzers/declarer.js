var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap
  , fluke = require( 'flukejs' );

function Declarer(emitter) {

  emitter.on( 'open scope', function( code ) {
    declare(code);
  } );

  emitter.on( 'end', function( bullshit, code ) {
    declare(code);
  } );

  function declare(code) {
    fluke.splitAll( code, function(type, lhs, rhs, token) {
        if (type == 'statement') {
          if (isType(lhs)) {
            emitter.emit( 'declare type', lhs );
          }
          else if (isFunctionDeclaration(lhs)) {
            emitter.emit( 'declare function', lhs );
          }

          function isFunctionDeclaration(code) {
            return code.search( regexMap.functionDeclare ) == 0;
          }

          function isType(code) {
            return code.search( regexMap.typeDeclare ) != -1;
          }
        }
      }, 
      { 'statement': ';' } 
    );
  }
}

exports.Declarer = Declarer;
