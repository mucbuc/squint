var assert = require( 'assert' );

function Scoper( emitter ) {

  var instance = this
    , depth = 0;

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
    { 
      emitter.emit( 'close scope', response.stash + response.lhs );
      response.resetStash();
    }
  } );
}

exports.Scoper = Scoper;
