var Header = require( './factory' ).Factory

Header.function = function( name ) {
	return '\n' + name + ';'; 
};

Header.type = function( name, code ) {
	var result = this.openScope( name );
	if (code.length)
		result += this.indent( code );
	result += this.closeScope( name );
	return result;
};

exports.Header = Header; 