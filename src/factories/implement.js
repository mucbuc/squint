var Implement = require( './factory' ).Factory

Implement.function = function( name ) {
	return '\n' + name + ';'; 
};

Implement.type = function() {
	return '';
};

exports.Implement = Implement; 
