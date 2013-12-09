var events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer;
  
function Builder(emitter)
{
	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , instance = this;

	init(); 

	this.process = function( code ) { 
		definer.process( code );
		declarer.process( code ); 
	};

	this.build = function( factory ) {
		return _build( factory, instance );
	};

	function _build( factory, obj ) {
		
		var result = '';

		if (typeof obj === 'undefined') 
			obj = instance;

		buildNamespaces( obj );
		buildTypes( obj );
		buildFunctions( obj );

		return result;

		function buildFunctions( obj ) {
			if (obj.hasOwnProperty( 'functions' )) {
				for (var p in obj.functions) {
					console.log( 'function:' );
				}
			}
		}

		function buildTypes( obj ) {
			if (obj.hasOwnProperty( 'types' )) {
				for (var p in obj.types) {
					buildType( obj.types[p] );
				}
			}

			if (obj.hasOwnProperty( 'function' ))
				buildFunction( obj.functions );
		}

		function buildNamespaces( obj ) {
			
			if (obj.hasOwnProperty( 'namespaces' )) {
				for (var p in obj.namespaces) {
					var content = _build( factory, obj.namespaces[p] );
					result += factory.defineNamespace( p, content ); 
				}
			}

			if (obj.hasOwnProperty( 'types' ))
				buildTypes( obj.types );
			if (obj.hasOwnProperty( 'functions' ))
				buildFunctions( obj.functions );
		}
	}

	function init() {

		instance.functions = {};
		instance.types = {};
		instance.namespaces = {};

		emitter.on( 'define namespace', function( context ) {
			
		 	var emitter = new events.EventEmitter()
			  , builder = new Builder( emitter ); 
			builder.process( context.code );

			instance.namespaces[context.name] = {
				namespaces: builder.namespaces,
				types: builder.types,
			};
		} );


		emitter.on( 'define type', function( context ) {

			var emitter = new events.EventEmitter()
			  , builder = new Builder( emitter );
			builder.process( context.code );

			instance.types[context.name] = {
				types: builder.types,
				functions: builder.functions
			};
		} );

		emitter.on( 'declare type', function( name ) {
			append( instance.types, { name: name } );
		} );

		emitter.on( 'define function', function( context ) {
			// get rid of declarations
			append( instance.functions, context ); 
		} );

		emitter.on( 'declare function', function( name ) {
			append( instance.functions, { name: name } );
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

exports.Builder = Builder; 