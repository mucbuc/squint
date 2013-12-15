var assert = require( 'assert' )
  , Parser = require( 'mucbuc-jsthree' ).Parser;

assert( typeof Parser === 'function' );

function Scoper( emitter, openToken, closeToken ) {
	
	var depth = 0
	  , content = ''
	  , sub;

	if (typeof emitter === 'undefined')
		return; 
	
	sub = Object.create( emitter.constructor.prototype );
	
	Parser.call( this, sub, initMap( openToken, closeToken ) );
	
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

		var result = {};

		if (typeof openToken === 'undefined') 
			openToken = '{'; 

		if (typeof closeToken === 'undefined') 
			closeToken = mapClosed();

		result[openToken] = 'open'; 
		result[closeToken] = 'close'; 
		return result;

		function mapClosed() {
			switch(openToken) {
				case '(': 
					return ')';
				case '[':
					return ']';
				case '<':
					return '>';
				case '{':
				default:
					return '}';
			}
		} 
	}
}

Scoper.prototype = new Parser(); 

exports.Scoper = Scoper;