var events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer;
  
function Interpreter(emitter)
{
	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , instance = this;

	init(); 

	this.process = function( code ) { 
		definer.process( code );
		declarer.process( code ); 
	};

	function init() {

		instance.functionDeclarations = {};
		instance.functionDefinitions = {};
		instance.typeDeclarations = {};
		instance.typeDefinitions = {};
		instance.namespaces = {};

		emitter.on( 'define namespace', function( context ) {
			
		 	var emitter = new events.EventEmitter()
			  , interpreter = new Interpreter( emitter ); 
			interpreter.process( context.code );

			//**** we don't want to process the context.code ==> different namespace 
//			declarer.process( context.name );	

			// instance.namespaces[context.name] = {
			// 	namespaces: interpreter.namespaces, 
			// 	functionDeclarations: interpreter.functionDeclarations, 
			// 	functionDefinitions: interpreter.functionDefinitions,
			// 	typeDeclarations: interpreter.typeDeclarations,
			// 	typeDefinitions: interpreter.typeDefinitions
			// };.

			instance.namespaces[context.name] = {
				namespaces: interpreter.namespaces,
				typeDeclarations: interpreter.typeDeclarations
			};
		} );


		emitter.on( 'define type', function( context ) {
			append( instance.typeDefinitions, context ); 
		} );

		emitter.on( 'declare type', function( name ) {
			append( instance.typeDeclarations, { name: name } );
		} );

		emitter.on( 'define function', function( context ) {
			append( instance.functionDefinitions, context ); 
		} );

		emitter.on( 'declare function', function( name ) {
			append( instance.functionDeclarations, { name: name } );
		} );
	}

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

	function append( obj, context ) {
		if (!obj.hasOwnProperty(context.code))
			obj[context.name] = '';
		obj[context.name] += context.code;
	}
}

exports.Interpreter = Interpreter; 