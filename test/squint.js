#!/usr/bin/env node

var assert = require( 'assert' )
  , squint = require( '../src/squint' )
  , Tester = require( 'mucbuc-jsthree' ).Tester
  , testLog = Tester.testLog;

assert( typeof squint != 'undefined' );

process.setMaxListeners( 0 );

comments();
defines();
includes();
arrayInitializerBlocks();
strings();

function strings() {
  var strip = squint.stripStrings;

  assert.equal( strip( '"text"text' ), 'text' );
  assert.equal( strip( '"text\\\"text"' ), '' );

  testLog( 'strings passed' );
}

function arrayInitializerBlocks() {
  var strip = squint.stripArrayInitializerBlocks;
  
  assert.equal( strip( 'int a[] = { 0, 3, 1 };' ), 'int a[];' );
  assert.equal( strip( 'int a[] = { 0, 3, 1 }; text text {};' ), 'int a[]; text text {};' );

  testLog( 'arrayInitializerBlocks passed' );
}

function includes() {

  var strip = squint.stripIncludes;

  assert.equal( strip( '#include' ), '' );
  assert.equal( strip( '#include\n' ), '' );
  assert.equal( strip( '#include "text.h"' ), '' );
  assert.equal( strip( '#include "text.h"\n' ), '' );
  
  assert.equal( strip( '# include' ), '' );
  assert.equal( strip( '#	include\n' ), '' );
  assert.equal( strip( '# 	include "text.h"	' ), '' );
  assert.equal( strip( '#  include "text.h"	\n' ), '' );

  testLog( 'includes passed' );
}

function defines() {
  var strip = squint.stripDefines;
  
  assert.equal( strip( '#define text \\   \n text' ), '' );
  assert.equal( strip( '#define text \ntext' ), 'text' );

  assert.equal( strip( '#define text  \ntext' ), 'text' );
  assert.equal( strip( '#define text \\\ntext' ), '' );
 
  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text text' ), '' );
  
  assert.equal( strip( '# define' ), '' );
  assert.equal( strip( '# define text text' ), '' );

  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text \\n text' ), '' );
  
  assert.equal( strip( '# define' ), '' );
  assert.equal( strip( '# define text \\n text' ), '' );
  assert.equal( strip( '# define text \\  \n text' ), '' );
  
  assert.equal( strip( '#undef' ), '' );
  assert.equal( strip( '# undef   \n' ), '' );
  
  assert.equal( strip( '#ifdef text' ), '#ifdef text' );
  assert.equal( strip( '# ifdef text' ), '# ifdef text' );
  
  testLog( 'defines passed' );
}

function comments() {

  var strip = squint.stripComments;

  assert.equal( strip( '/ text' ), '/ text' );
  assert.equal( strip( 'text' ), 'text' );
  assert.equal( strip( '/ * text; * /' ), '/ * text; * /' );
  assert.equal( strip( '/* text; * /' ), '/* text; * /' );
  assert.equal( strip( '/ * text; */' ), '/ * text; */' );

  assert.equal( strip( '// text \n' ), '' );
  assert.equal( strip( '// text \n\n' ), '\n' );
  assert.equal( strip( '// text \ntext // text\n' ), 'text ' );
  assert.equal( strip( '// text ' ), '' );
  assert.equal( strip( '// text \ntext // text' ), 'text ' );
  
  assert.equal( strip( '/* text */' ), '' ); 
  assert.equal( strip( '/* text */text /*text*/' ), 'text ' ); 

  testLog( 'comments passed' );
}
