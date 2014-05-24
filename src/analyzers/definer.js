/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 


var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper
  , regexMap = require( '../regexmap' ).regexMap;

assert( typeof Scoper === 'function' );
assert( typeof regexMap !== 'undefined' );
assert( typeof regexMap.typeDefinitionSplitter !== 'function' ); 
assert( typeof regexMap.typeDefinitionSplitter !== 'function' ); 


function Definer(emitter) {
	
	Scoper.call( this, emitter );

	emitter.on( 'open scope', function( code ) {

		assert( code.search(  /.*?;/ ) === -1 ); // TODO: write test for this
		
		var name = code.trim();

		if (isNamespace(code)) 
			initDefine( 'namespace', name ); 
		else if (isType(code)) 
			initDefine( 'type', name, name.match( regexMap.typeDefinitionSplitter, '' ) );
		else if (isFunction(code)) 
			initDefine( 'function', name, name.match( regexMap.constructorSplitter, '' ) );

		function isFunction( code ) {
			return code[code.length - 1] == ')';
		}

		function isType( code ) {
			return code.search( /(struct|class)/ ) != -1; 
		}

		function isNamespace( code ) {
			return code.indexOf( 'namespace' ) == 0;
		}

		function initDefine( type, name, matches ) {
			emitter.once( 'close scope', function( code ) {
				if (matches)
					emitter.emit( 'define ' + type, { 
						name: matches[1].trim(),
						code: code, 
						meta: matches[2].trim(), 
					} );
				else 
					emitter.emit( 'define ' + type, { 
						name: name,
						code: code 
					} );
			} );
		}
	} ); 
}

Definer.prototype = new Scoper();

exports.Definer = Definer;