/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 


var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper
  , Preprocessor = require( './preprocessor' ).Preprocessor
  , regexMap = require( '../regexmap' ).regexMap; 

assert( typeof Scoper === 'function' );
assert( typeof regexMap !== 'undefined' );
assert( typeof regexMap.typeDefinitionSplitter !== 'function' ); 
assert( typeof regexMap.typeDefinitionSplitter !== 'function' ); 
assert( typeof Preprocessor !== 'undefined' );

function Definer(emitter) {
	
	Scoper.call( this, emitter );

	emitter.on( 'open scope', function( code ) {

		var preprocessor = new Preprocessor( emitter ); 

		code = code.replace( /.*?;/, '' ).trim()
		code = preprocessor.process( code ).trim();

		if (isNamespace(code)) 
			initDefine( 'namespace', code ); 
		else if (isType(code)) 
			initDefine( 'type', code, code.match( regexMap.typeDefinitionSplitter, '' ) );
		else if (isFunction(code)) 
			initDefine( 'function', code, code.match( regexMap.constructorSplitter, '' ) );
		
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
	
/*

else 
		


	emitter.on( 'end', parseTypedefs ); 
	emitter.on( 'statement', parseTypedefs ); 

	function parseTypedefs( code ) {

		console.log( 'parseTypedefs', code );

		if (isTypedef(code)) {
			emitter.emit( 'define typedef', { 
				name: 'temp',
				code: code 
			} );
		}

		function isTypedef( code ) {
			return code.search( /typedef/ ) != -1; 
		}
	}
*/ 

}

Definer.prototype = new Scoper();

exports.Definer = Definer;