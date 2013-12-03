var events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer;
  
function Interpreter(emitter)
{
	var functionDeclarations = {}
	  , functionDefinitions = {}
	  , typeDeclarations = {}
	  , typeDefinitions = {}
	  , namespaces = {}
	  , declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , instance = this;

	init(); 

	this.__defineGetter__( 'functionDeclarations', function() {
		return functionDeclarations;
	} );

	this.__defineGetter__( 'functionDefinitions', function() {
		return functionDefinitions;
	} );
	
	this.__defineGetter__( 'typeDeclarations', function() {
		return typeDeclarations;
	} );	

	this.__defineGetter__( 'typeDefinitions', function() {
		return typeDefinitions;
	} );

	this.__defineGetter__( 'namespaces', function() {
		return namespaces;
	} );

	this.process = function( code ) { 
		declarer.process( code );
		definer.process( code ); 
	}; 

	function init() {

		emitter.on( 'define namespace', function( context ) {
		//	var emitter = new events.EventEmitter()
		//	  , interpreter = new Interpreter( emitter ); 

			append( namespaces, context ); 
		//	interpreter.process( context.code );
			//merge( namespaces[context.name], interpreter );	
		//	namespaces[context.name].typeDeclarations = interpreter.typeDeclarations;
		//	console.log( interpreter.typeDeclarations ); 
		} ); 

		emitter.on( 'define type', function( context ) {
			append( typeDefinitions, context ); 
		} );

		emitter.on( 'declare type', function( name ) {
			append( typeDeclarations, { name: name } );
		} );

		emitter.on( 'define function', function( context ) {
			append( functionDefinitions, context ); 
		} );

		emitter.on( 'declare function', function( name ) {
			append( functionDeclarations, { name: name } );
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