/*
  think of this type as of scope "type".

    namespace
    type
    function
*/

var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap
  , fluke = require( 'flukejs' );

assert( typeof regexMap !== 'undefined' );

function Definer(emitter, rules) {

  emitter.on( 'open scope', function( code, source, token ) {
    code = code.replace( /.*?;/, '' ).trim()

    if (isNamespace(code))
      initDefine( 'namespace', code );
    else if (isType(code))
      initDefine( 'type', code, code.match( regexMap.typeDefinitionSplitter, '' ) );
    else if (isFunction(code))
      initDefine( 'function', code, code.match( regexMap.constructorSplitter, '' ) );

    console.log( '*splitNext:', source );
    process.nextTick( function() { 
        fluke.splitNext( source, function(type, lhs, rhs, token) {
            console.log( arguments );
            emitter.emit( type, lhs, rhs, token );
          }, rules );
      } );

    function isFunction( code ) {
      return code[code.length - 1] == ')';
    }

    function isType( code ) {
      return code.search( /(struct|class)/ ) != -1;
    }

    function isNamespace( code ) {
      return code.indexOf( 'namespace' ) == 0;
    }

    function initDefine( type, name, matches ) {
      emitter.once( 'close scope', function( code ) {
        if (matches)
          emitter.emit( 'define ' + type, {
            name: matches[1].trim(),
            code: code,
            meta: matches[2].trim(),
          } );
        else
          emitter.emit( 'define ' + type, {
            name: name,
            code: code.trim()
          } );
      } );
    }
  } );
}

exports.Definer = Definer;
