var Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Builder = require( '../src/builder' ).Builder;
  

function Interpreter()
{
	var declarer = new Declarer()
	  , definer = new Definer()
	  , declarations = {}
	  , definitions = {};

	this.process = function( code, emitter ) {
		declarations = merge( declarations, declare( code, emitter ).types );
	//	definitions = merge( definitions, define( code, emitter ).definitions );	
	};

	this.__defineGetter__( 'definitions', function() {
		return definitions;
	} );
	
	this.__defineGetter__( 'declarations', function() {
		return declarations;
	} );

	function declare( code, emitter ) {
		var builder = new Builder( emitter, {} );
		declarer.process( code, emitter ); 
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
				dst[property] += src[property]; 
			}
			else {
				dst[property] = src[property];
			}
		}
		return dst;
	}
}

exports.Interpreter = Interpreter; 