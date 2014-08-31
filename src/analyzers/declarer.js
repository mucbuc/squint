var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap
  , fluke = require( 'flukejs' );

function Declarer(emitter) {

  emitter.on( 'open scope', function( response ) {
    declare( response );
  } );

  emitter.on( 'end', function( response ) {
    declare( response.stash );
  } );

  function declare(code) {
    fluke.splitAll( code, function(type, response) {
        if (type == 'statement') {
          if (isType(response.lhs)) {
            emitter.emit( 'declare type', response.lhs );
          }
          else if (isFunctionDeclaration(response.lhs)) {
            emitter.emit( 'declare function', response.lhs );
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
