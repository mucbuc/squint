var Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Builder = require( '../src/builder' ).Builder;
  

function Interpreter(emitter)
{
	var declarations = {}
	  , definitions = {}
	  , builder = new Builder( emitter, {} )
	  , declarer = new Declarer(emitter)
	  , definer = new Definer(emitter);

	this.__defineGetter__( 'definitions', function() {
		return definitions;
	} );
	
	this.__defineGetter__( 'declarations', function() {
		return declarations;
	} );

	this.declare = function( code ) {
		builder.init();
		declarer.process( code );
		merge( declarations, builder.product ); 
	};

	this.define = function( code ) {
		builder.init();
		definer.process( code ); 
		merge( definitions, builder.product ); 
	}; 

	function merge( dst, src ) {
		for (var property in src) {
			if (dst.hasOwnProperty(property)) {
				if (dst[property] instanceof String) {
					dst[property] += src[property]; 
				}
				else {
					merge( dst[property], src[property] );
				}
			}
			else {
				dst[property] = src[property];
			}
		}
	}
}

exports.Interpreter = Interpreter; 