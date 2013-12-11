var Factory = require( './factory' ).Factory

function Header() {
	Factory.call( this );
};

Header.prototype = new Factory();

Header.prototype.function = function( name ) {
	return '\n' + name + ';'; 
};

Header.prototype.type = function( name, code ) {
	var result = this.openScope( name );
	if (	typeof code !== 'undefined'
		&& 	code.length)
		result += this.indent( code );
	result += this.closeScope( name ) + ';';
	return result;
};

exports.Header = Header; 