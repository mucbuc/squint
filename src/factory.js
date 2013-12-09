/* 
objective: 
	- create basic components to be assembled by builder

notes: 
	- doesn't holds product specific states
*/ 

var Utills = { 
	indent: function( code ) {
		code = '\t' + code;
		return code.replace( /\n/, '\n\t' ); 
	}, 
	openScope: function( name ) {
		return name + '\n{\n';
	}, 
};

Factory = {

	Utills: Utills,

	declareFunction: function( name ) {
		return name + ';\n';
	},

	declareType: function( name ) {
		return name + ';\n';
	},

	openType: Utills.openScope, 

	closeType: function(name) {
		return '\n};\n';
	}, 

	defineType: function( name, code ) {
		var result = this.openType( name );
		result += Utills.indent( code ); 
		result += this.closeType( name );
		return result;
	},

	openFunction: Utills.openScope,

	closeFunction: function() {
		return '\n}\n'; 
	},

	defineFunction: function( name, code ) {
		var result = this.openFunction( name );
		result += Utills.indent( code + this.closeFunction( name ) );
		return result;
	},

	openNamespace: Utills.openScope,

	closeNamespace: function( name ) { 
		return '\n} // ' + name + '\n'; 
	},

	defineNamespace: function( name, code ) {
		var result = code + this.closeNamespace( name );
		result = Utills.indent( result );
		result = this.openNamespace( name ) + result;
		return result;
	},

};

exports.Factory = Factory; 