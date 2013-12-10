var Forward = require( './factory' ).Factory

Forward.function = function( name ) {
	return ''; 
};

Forward.type = function( name ) {
	return '\n' + name + ';';
};

exports.Forward = Forward; 