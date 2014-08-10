var assert = require( 'assert' )
  , fluke = require( 'flukejs' );

assert( typeof fluke !== 'undefined' );

function Scoper( emitter, openToken, closeToken ) {

	var instance = this
    , depth = 0
	  , content = '';

	if (typeof emitter === 'undefined')
		return;

	this.process = function( code, rules ) {
		if (typeof rules === 'undefined') {
			rules = initMap( openToken, closeToken ); 
		}

		fluke.splitAll( code, function( type, token, source ) { 
			  	emitter.emit( type, token, source );
			  } 
		  , rules ); 
	}; 

	emitter.on( 'open', function(code) {
		if (!depth)
			emitter.emit( 'open scope', code.trim() );
		else
			content += code.trim() + openToken;
		++depth;
	} );

	emitter.on( 'close', function(code) {
		assert( depth );

		if (!--depth) {
			emitter.emit( 'close scope', content + code.trim() );
			content = '';
		}
		else {
      content += code.trim() + mapClosedString();
		}
	} );

  // emitter.on( 'comment', function() {
  //   emitter.remove( 'open' ..
  //   emitter.remove( 'close' ... )
  // });

  /* hackybacky this belongs on a higher level, what if content should be ignored?
    Or what if new token gets added? same with two cases above
  */
  emitter.on( 'statement', function(code) {
    content += code.trim() + ';';
  } );

  function mapClosedString() {
    switch(openToken) {
      case '(':
        return ')';
      case '[':
        return ']';
      case '<':
        return '>';
      case '{':
        return '}';
      default:
        return '\n';
    }
  }

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
