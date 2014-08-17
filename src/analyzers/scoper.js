var assert = require( 'assert' );

function Scoper( emitter ) {

  var instance = this
    , depth = 0;

  if (typeof emitter === 'undefined')
    return;

  emitter.on( 'open', function(response) {
    if (!depth)
    {
      emitter.emit( 'open scope', response.lhs );
      response.resetStash(); 
    }
    ++depth;
  } );

  emitter.on( 'close', function(response) {
    assert( depth );
    
    if (!--depth) 
      emitter.emit( 'close scope', response.stash + response.lhs );
  } );
}

exports.Scoper = Scoper;
