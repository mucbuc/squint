var assert = require( 'assert' )
  , events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Preprocessor = require( './preprocessor' ).Preprocessor
  , Model = require( '../model' ).Model;

assert( typeof Declarer === 'function' ); 
assert( typeof Definer === 'function' );
assert( typeof Model === 'function' ); 
assert( typeof Preprocessor !== 'undefined' );

function Compiler( emitter ) {

	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , model = new Model(); 

	init(); 

	this.process = function( code ) {
		var subEmitter = Object.create( emitter.constructor.prototype )
		  , preprocessor = new Preprocessor( subEmitter ); 
		subEmitter.on( 'preprocess', function( prepCode ) {
			code = code.replace( prepCode, '' ).trim();
			definer.process( code );
			declarer.process( code ); 
		} );
	};

	function init() {

		emitter.on( 'define namespace', function( context ) {
			
		 	var subEmitter = Object.create( emitter.constructor.prototype )
		 	  , compiler = new Compiler( subEmitter ); 
			
			subEmitter.once( 'compile', function(obj) { 
				model.appendNamespace( context.name, obj );
			} ); 
			compiler.process( context.code, subEmitter );
		} );

		emitter.on( 'define type', function( context ) {

			var subEmitter = Object.create( emitter.constructor.prototype ) 
			  , compiler = new Compiler( subEmitter );

			subEmitter.once( 'compile', function( obj ) {
				model.appendType( context.name, obj );
			} ); 

			compiler.process( context.code, subEmitter );
		} );

		emitter.on( 'declare type', function( name ) {
			model.appendType( name );
		} );

		emitter.on( 'define function', function( context ) {
			model.appendFunction( context.name, context.code );
		} );

		emitter.on( 'declare function', function( name ) {
			model.appendFunction( name );
		} );

		emitter.on( 'end', function() { 
			emitter.emit( 'compile', model ); 
		} );
	}
}

exports.Compiler = Compiler; 