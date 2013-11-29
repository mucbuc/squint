var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( './parser' ).Parser

function Scoper( openToken, closeToken ) {
	
	var depth = 0
	  , content = ''
	  , ParserProcess; 

	Parser.call( this, initMap( openToken, closeToken ) );

	ParserProcess = this.process;

	this.process = function(code, emitter) {

		var sub = new events.EventEmitter();

		sub.on( 'open', function(code) {
			if (!depth)
				emitter.emit( 'open scope', code );
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
				content += '}' + code.trim();
			}
		} );

		sub.on( 'end', function(code) {
			emitter.emit( 'end', code.trim() );
		} );

		ParserProcess( code, sub );
	};

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