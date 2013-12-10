var Factory = require( './factory' ).Factory

function Header() {
	
	Factory.call( this );

	this.function = function( name ) {
		return '\n' + name + ';'; 
	}; 
	this.type = function( name, code ) {
		var result = this.openScope( name );
		if (code.length)
			result += this.indent( code );
		result += this.closeScope( name ) + ';';
		return result;
	};
};

Header.prototype = new Factory();

exports.Header = Header; 