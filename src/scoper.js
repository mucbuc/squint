var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( './parser' ).Parser;

function Scoper( emitter, openToken, closeToken ) {
	
	var depth = 0
	  , content = ''
	  , sub = new events.EventEmitter();

	Parser.call( this, sub, initMap( openToken, closeToken ) );
	
	sub.on( 'open', function(code) {
		if (!depth)
			emitter.emit( 'open scope', code.trim() );
		else
			content += code.trim() + '{'; 
		++depth;
	} ); 

	sub.on( 'close', function(code) { 
		assert( depth );

		if (!--depth) {
			emitter.emit( 'close scope', content + code.trim() );
			content = '';
		}
		else {
			content += code.trim() + '}';
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