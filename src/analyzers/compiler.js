var assert = require( 'assert' )
  , events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer;

assert( typeof Declarer === 'function' ); 
assert( typeof Definer === 'function' );
  
function Compiler( emitter ) {

	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , model = emptyModel();

	init(); 

	this.process = function( code ) { 
		definer.process( code );
		declarer.process( code ); 
	};

	function init() {

		emitter.on( 'define namespace', function( context ) {
			
		 	var subEmitter = new events.EventEmitter()
			  , compiler = new Compiler( subEmitter ); 
			
			subEmitter.once( 'compile', appendModel ); 
			compiler.process( context.code, subEmitter );

			function appendModel( sub ) {
				model.namespaces[context.name] = {
					namespaces: sub.namespaces,
					types: sub.types,
					functions: sub.functions,
				};
			}
		} );

		emitter.on( 'define type', function( context ) {

			var subEmitter = new events.EventEmitter()
			  , compiler = new Compiler( subEmitter );

			subEmitter.once( 'compile', appendModel ); 

			compiler.process( context.code, subEmitter );
			
			function appendModel( sub ) {
				model.types[context.name] = {
					types: sub.types,
					functions: sub.functions,
				};
			}

		} );

		emitter.on( 'declare type', function( name ) {
			append( model.types, { name: name } );
		} );

		emitter.on( 'define function', function( context ) {
			append( model.functions, context ); 
		} );

		emitter.on( 'declare function', function( name ) {
			append( model.functions, { name: name } );
		} );

		emitter.on( 'end', function() { 
			emitter.emit( 'compile', model ); 
			//model = emptyModel();
		} );

		function append( obj, context ) {
			if (!obj.hasOwnProperty(context.code))
				obj[context.name] = '';
			obj[context.name] += context.code;
		}
	}

	function emptyModel() {
	return { 
		functions: {},
	  types: {},
	  namespaces: {},
  };
}
}

exports.Compiler = Compiler; 