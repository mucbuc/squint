var Factory = require( './factory' ).Factory

function Implement() {

	Factory.call( this );

	this.function = function( name ) {
		return '\n' + name + ';'; 
	};
	this.type = function() {
		return '';
	};
};

Implement.prototype = new Factory();

exports.Implement = Implement; 
