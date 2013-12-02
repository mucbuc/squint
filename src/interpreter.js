var Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Builder = require( '../src/builder' ).Builder;
  

function Interpreter(emitter)
{
	var declarer = new Declarer()
	  , definer = new Definer()
	  , declarations = {}
	  , definitions = {};

	// merge( declarations, declare( code, emitter ) );
	// merge( definitions, define( code, emitter ).definitions );	

	this.__defineGetter__( 'definitions', function() {
		return definitions;
	} );
	
	this.__defineGetter__( 'declarations', function() {
		return declarations;
	} );

	function declare( code, emitter ) {
		var builder = new Builder( emitter, {} );

		console.log( 'builder.product', builder.product );

		declarer.process( code, emitter );
		builder.removeAll();
		return builder.product; 
	}

	function define( code, emitter ) {
		var builder = new Builder( emitter, {} );
		definer.process( code, emitter ); 
		return builder.product; 
	}

	function merge( dst, src ) {
		for (var property in src) {
			if (dst.hasOwnProperty(property)) {
				if (dst[property] instanceof String) {
					dst[property] += src[property]; 
				}
				else {
					dst[property] = merge( dst[property], src[property] );
				}
			}
			else {
				dst[property] = src[property];
			}
		}
	}
}

exports.Interpreter = Interpreter; 