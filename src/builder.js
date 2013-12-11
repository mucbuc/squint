var assert = require( 'assert' );
  
function Builder( model )
{
	this.build = function( factory ) {
		return _build( factory, model );
	};

	function _build( factory, obj, prefix ) {

		var result = '';

		if (typeof obj === 'undefined' )
			obj = model;
			
		buildNamespaces( obj );
		buildTypes( obj );
		buildFunctions( obj );

		return result;

		function buildFunctions( obj ) {
			if (obj.hasOwnProperty( 'functions' )) {
				for (var p in obj.functions) {
					var name = p.trim();

					if (typeof prefix !== 'undefined') {
						var matches = prefix.match( /(.*>)(.*)/ );

						if (matches) {
							assert( matches.length == 2 );
							name = factory.defineMemberName( name, matches[0].trim(), matches[1].trim() ); 
						}
						else 
							name = factory.defineMemberName( name, prefix )
					}
					result += factory.function( name, obj.functions[p] ); 
				}
			}
		}

		function buildTypes( obj ) {
			
			if (obj.hasOwnProperty( 'types' )) {
				for (var p in obj.types) {
					var name = p.trim()
					  , content = _build( factory, obj.types[p], name );
					result += factory.type( name, content );
				}
			}

			if (obj.hasOwnProperty( 'function' ))
				buildFunction( obj.functions );
		}

		function buildNamespaces( obj ) {
			
			if (obj.hasOwnProperty( 'namespaces' )) {
				for (var p in obj.namespaces) {
					var content = _build( factory, obj.namespaces[p] );
					result += factory.namespace( p, content ); 
				}
			}

			if (obj.hasOwnProperty( 'types' ))
				buildTypes( obj.types );
			if (obj.hasOwnProperty( 'functions' ))
				buildFunctions( obj.functions );
		}
	}
}

exports.Builder = Builder; 