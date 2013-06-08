var assert = require( 'assert' )
  , squint = require( 'squint' )
  , strip = squint.stripComments;

assert.equal( strip( '/ a' ), '/ a' );
assert.equal( strip( 'a' ), 'a' );

assert.equal( strip( '/ * a; * /' ), '/ * a; * /' );
assert.equal( strip( '/* a; * /' ), '/* a; * /' );
assert.equal( strip( '/ * a; */' ), '/ * a; */' );

assert.equal( squint.stripComments( '// bla \n' ), '' );
assert.equal( squint.stripComments( '/* helleo */' ), '' ); 
