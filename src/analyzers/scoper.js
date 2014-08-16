var assert = require( 'assert' );

function Scoper( emitter, cb ) {

  var instance = this
    , depth = 0
    , content = '';

  if (typeof emitter === 'undefined')
    return;

  emitter.on( 'open', function(code, src, token) {
    if (!depth)
      emitter.emit( 'open scope', code.trim(), src, token );
    else
      content += code.trim() + token;
    ++depth;
    cb( src );
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
    cb( src ); 
  } );

  emitter.on( 'statement', function(code, src) {
    content += code.trim() + ';';
    cb(src);
  } );
}

exports.Scoper = Scoper;
