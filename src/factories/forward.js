var Factory = require( './factory' ).Factory

function Forward() {
	Factory.call( this ); 

	this.function = function( name ) {
		return ''; 
	}; 
	
	this.type = function( name ) {
		return '\n' + name + ';';
	};
}

Forward.prototype = new Factory();

exports.Forward = Forward; 