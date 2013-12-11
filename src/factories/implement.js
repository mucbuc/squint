var assert = require( 'assert' )
  , Factory = require( './factory' ).Factory

function Implement() {
	Factory.call( this );
};

Implement.prototype = new Factory();

Implement.prototype.function = function( name, code ) {
	var result = this.openScope( name ); 
	if (code !== 'undefined')
		result += '\n' + this.indent( code );
	result += this.closeScope( name ); 
	return result; 
};
Implement.prototype.type = function(name, code) {
	return code;
};

Implement.prototype.defineMemberName = function( member, type ) {

	if (typeof type !== 'undefined') {
		var functionName = ''
		  , match = member.match( /(\w+\s*\(.*)/g )
		  , returnType
		  , functionName; 

		assert( match && match.length == 1);
		functionName = match[0];

		returnType = member.substr( 0, member.length - functionName.length );

		return returnType.trim() + ' ' + type.replace( /struct|class/, '' ).trim() + '::' + functionName;
	}

	return member; 
};

exports.Implement = Implement; 
