var assert = require( 'assert' )
  , squint = require( 'squint' );
  
assert.equal( squint.stripComments( '/*blabla*/' ), '' );