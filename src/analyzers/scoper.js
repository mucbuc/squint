var assert = require( 'assert' )
  , fluke = require( 'flukejs' );

assert( typeof fluke !== 'undefined' );

function Scoper( emitter, openToken, closeToken ) {

  var instance = this
    , depth = 0
    , content = ''
    , _rules = {};

  if (typeof emitter === 'undefined')
    return;

  this.process = function( code, rules ) {
    if (typeof rules === 'undefined') {
      rules = initMap( openToken, closeToken ); 
    }
    _rules = rules;
    splitNext( code, rules );
  }; 

  emitter.on( 'open', function(code, src, token) {
    if (!depth)
      emitter.emit( 'open scope', code.trim(), src, token );
    else
      content += code.trim() + token;
    ++depth;
    splitNext( src, _rules ); 
  } );

  emitter.on( 'close', function(code, src, token) {
    assert( depth );

    if (!--depth) {
      emitter.emit( 'close scope', content + code.trim(), src, token );
      content = '';
    }
    else {
      content += code.trim() + token;
    }
    splitNext( src, _rules ); 
  } );
  
  function splitNext( code, rules ) {
    fluke.splitNext( code, function( type, lhs, rhs, token ) { 
        emitter.emit( type, lhs, rhs, token );
      } 
      , rules );
  }

  // this.step = function( code, rules ) {
  //   if (typeof rules === 'undefined') {
  //     rules = initMap( openToken, closeToken ); 
  //   }

  //   fluke.splitNext( code, function( type, lhs, rhs, token ) {
  //       emitter.emit( type, lhs, rhs, token );
  //     }, rules );
  // };



  // emitter.on( 'comment', function() {
  //   emitter.remove( 'open' ..
  //   emitter.remove( 'close' ... )
  // });

  /* hackybacky this belongs on a higher level, what if content should be ignored?
    Or what if new token gets added? same with two cases above

  *Response: the content can optionally be ignored at the higher level. content doesn't
  refer to what is in the result but what is in the current scope. 
  The problem here is that Scoper needs to know about tags like "statement" and any added ones 
  in order to correctly parse the content. I need to splitNext with "{}" (this is assuming that 
  Preprocessor directives and comments have been removed).
  */
  emitter.on( 'statement', function(code) {
    content += code.trim() + ';';
  } );

  function initMap() {
    var result = {};
    if (typeof openToken === 'undefined')
      openToken = '{';
    result['open'] = openToken;

    if (typeof closeToken === 'undefined')
      closeToken = mapClosed();
    result['close'] = closeToken;
    return result;

    function mapClosed() {
      switch(openToken) {
        case '\\(':
          return '\\)';
        case '\\[':
          return '\\]';
        case '<':
          return '>';
        case '{':
        default:
          return '}';
      }
    }
  }
}

exports.Scoper = Scoper;
