var Factory = require( './factory' ).Factory

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
			return type + '::' + member;
		}

		return member; 
	};
};

Implement.prototype = new Factory();

exports.Implement = Implement; 
