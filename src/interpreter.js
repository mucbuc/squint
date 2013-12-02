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
		
		//console.log( 'Interpreter proces b', declarations, code ); 

		merge( declarations, declare( code, emitter ) );
	//	definitions = merge( definitions, define( code, emitter ).definitions );	

		//console.log( 'Interpreter proces e', declarations, code ); 

	};

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