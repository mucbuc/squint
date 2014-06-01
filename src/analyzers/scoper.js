var assert = require( 'assert' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer;

assert( typeof Tokenizer === 'function' );

function Scoper( emitter, openToken, closeToken ) {

	var instance = this
    , depth = 0
	  , content = ''
	  , sub;

	if (typeof emitter === 'undefined')
		return;

	sub = Object.create( emitter.constructor.prototype );

	Tokenizer.call( this, sub );

  initMap( openToken, closeToken );

	sub.on( 'open', function(code) {
		if (!depth)
			emitter.emit( 'open scope', code.trim() );
		else
			content += code.trim() + openToken;
		++depth;
	} );

	sub.on( 'close', function(code) {
		assert( depth );

		if (!--depth) {
			emitter.emit( 'close scope', content + code.trim() );
			content = '';
		}
		else {
			content += code.trim() + closeToken;
		}
	} );

	sub.on( 'end', function(code) {
		emitter.emit( 'end', code.trim() );
	} );

	function initMap() {

		if (typeof openToken === 'undefined')
			openToken = '{';
    instance.match( openToken, 'open' );

		if (typeof closeToken === 'undefined')
			closeToken = mapClosed();
    instance.match( closeToken, 'close' );

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
