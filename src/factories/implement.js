var assert = require( 'assert' )
  , Factory = require( './factory' ).Factory

function Implement() {

	Factory.call( this );

	this.function = function( name, code ) {
		var result = this.openScope( name ); 
		if (code !== 'undefined')
			result += '\n' + this.indent( code );
		result += this.closeScope( name ); 
		return result; 
	};
	this.type = function(name, code) {
		return code;
	};

	this.defineMemberName = function( member, type ) {

		if (typeof type !== 'undefined') {
			var functionName = ''
			  , match = member.match( /(\w+\s*\(.*)/g )
			  , returnType
			  , functionName; 

			assert( match && match.length == 1);
			functionName = match[0];

			returnType = member.substr( 0, member.length - functionName.length );

			return returnType + ' ' + type.replace( 'struct', '' ) + '::' + functionName;
		}

		return member; 
	};
};

Implement.prototype = new Factory();

exports.Implement = Implement; 
