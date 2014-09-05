var assert = require( 'assert' )
  , fluke = require( 'flukejs' );

function Scoper( emitter, rules ) {

  var instance = this
    , depth = 0;

  if (typeof rules === 'undefined') {
    rules = {
        'open': '{',
        'close': '}'
      };
  }

  emitter.on( 'open', function(response) {
    var depth = 1;
    emitter.emit( 'open scope', response.lhs );
    response.resetStash(); 
    do {
      var content = '';
      fluke.splitNext(response.rhs, function(type, inner) {  
        if (type == 'open') {
          ++depth; 
        }
        else if (type == 'close' || type == 'end') {
          if (!--depth) {
            content += inner.lhs;
            emitter.emit( 'close scope', content );
            response.consume( content.length );
            response.resetStash();
          }
        }
        else if (type == 'end') {
          if (!--depth) {
            emitter.emit( 'end', inner );
          }
        }
      }, rules );
    } 
    while(depth); 
  } );
}

exports.Scoper = Scoper;
