/* 
objective: 
	- create basic components to be assembled by builder

notes: 
	- doesn't holds product specific states
*/ 

var Utills = { 
	indent: function( code ) {
		code = '\n' + code;
		return code.replace( /\n/g, '\n\t' ); 
	}, 
	openScope: function( name ) {
		return '\n' + name + '\n{';
	}, 
};

Factory = {

	Utills: Utills,

	declareFunction: function( name ) {
		return '\n' + name + ';';
	},

	declareType: function( name ) {
		return '\n' + name + ';';
	},

	openType: Utills.openScope, 

	closeType: function(name) {
		return '\n' + '};';
	}, 

	defineType: function( name, code ) {
		var result = this.openType( name );
		if (code.length)
			result += Utills.indent( code );
		result += this.closeType( name );
		return result;
	},

	openFunction: Utills.openScope,

	closeFunction: function() {
		return '\n}'; 
	},

	defineFunction: function( name, code ) {
		var result = this.openFunction( name );
		result += Utills.indent( code );
		result += this.closeFunction( name );
		return result;
	},

	openNamespace: Utills.openScope,

	closeNamespace: function( name ) { 
		return '\n} // ' + name; 
	},

	defineNamespace: function( name, code ) {
		var result = this.openNamespace( name );
		result += Utills.indent( code );
		result += this.closeNamespace( name );
		return result;
	},

};

exports.Factory = Factory; 