var Factory = require( './factory' ).Factory

function Forward() {
	Factory.call( this ); 
}

Forward.prototype = new Factory();

Forward.prototype.function = function( name ) {
	return ''; 
}; 

Forward.prototype.type = function( name ) {
	return '\n' + name + ';';
};

exports.Forward = Forward; 