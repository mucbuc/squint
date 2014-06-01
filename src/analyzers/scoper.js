var assert = require( 'assert' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer;

assert( typeof Tokenizer === 'function' );

function Scoper( emitter, openToken, closeToken ) {

	var instance = this
    , depth = 0
	  , content = '';

	if (typeof emitter === 'undefined')
		return;

	Tokenizer.call( this, emitter, initMap( openToken, closeToken ) );

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
			content += code.trim() + closeToken;
		}
	} );

  // hackybacky this belongs on a higher level, what if content should be ignored?
  emitter.on( 'statement', function(code) {
    content += code.trim() + ';';
  } );

	emitter.on( 'end', function(code) {
		emitter.emit( 'end', code.trim() );
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

Scoper.prototype = new Tokenizer();

exports.Scoper = Scoper;
