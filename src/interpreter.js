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
		declarations = declare( code, emitter ); //merge
		definitions = define( code, emitter );	//merge
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
}

exports.Interpreter = Interpreter; 