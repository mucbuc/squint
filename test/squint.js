#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Squint = require( '../src/squint' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , test = require( './base').test;

assert( typeof Squint !== 'undefined' );

process.setMaxListeners( 0 );

runTest(); 

function runTest() {

  test( stripTypedefs );
  test( stripComments );
  test( stripDefines );
  test( stripIncludes );
  test( stripArrayInitializerBlocks );
  test( stripStrings );
  test( testForward );
  test( testDeclare );
  test( testDefine ); 
  test( testPreprocessor );

  function stripTypedefs() {
    var strip = Squint.stripTypedefs;
    assert.equal( strip( 'typedef str::string string_type;' ), '' );
  }

  function testPreprocessor() {
    var strip = Squint.stripPreprocessor;
    
    assert.equal( strip( '#ifndef TEExT_032_H' ), '' );
    assert.equal( strip( '#endif' ), '' );
    assert.equal( strip( '      #pragma dfadfasfa' ), '' );
    assert.equal( strip( '"#pragma dfadfasfa"' ), '"#pragma dfadfasfa"' );
    assert.equal( strip( '#ifndef E_H\n' ), '\n' );
    assert.equal( strip( '#ifndef E_H\n#define E_H\nclass forward;' ), '\n\nclass forward;' );
  }

  function testDefine() {
    Squint.compile( 'namespace hello { void foo(); }', function( result ) {
      Squint.define( result, function( result ) {
        assert.match( result, /\s*namespace\s+hello\s*{\s*void\s+foo\s*\(\s*\)\s*{\s*}\s*}.*/ );
      } );
    } ); 

    Squint.compile( 'namespace hello { struct world { void foo(); }; }', function( result ) {
      Squint.define( result, function( result ) {
        assert.match( result, /\s*namespace\s+hello\s*{\s*void\s+world::foo\(\s*\)\s*{\s*}\s*}.*/ );
      } ); 
    } ); 
  }

  function testDeclare() {
    Squint.compile( 'namespace hello { struct world {}; }', function( result ) {
      Squint.declare( result, function( result ) {
        assert.match( result, /\s*namespace\s+hello\s*{\s*struct\s+world\s*{\s*};\s*}/ ); 
      } );
    } );
  }

  function testForward() {
    Squint.compile( 'namespace hello { struct world {}; }', function( result ) {
      Squint.forward( result, function( result ) {
        assert.match( result, /\s*namespace\s+hello\s*{\s*struct\s+world;\s*}/ ); 
      } );
    } );
  }

  function stripStrings() {
    var strip = Squint.stripStrings;

    assert.equal( strip( '"text"text' ), 'text' );
    assert.equal( strip( '"text\\\"text"' ), '' );
  }

  function stripArrayInitializerBlocks() {
    var strip = Squint.stripArrayInitializerBlocks;
    
    assert.equal( strip( 'int a[] = { 0, 3, 1 };' ), 'int a[];' );
    assert.equal( strip( 'int a[] = { 0, 3, 1 }; text text {};' ), 'int a[]; text text {};' );
  }

  function stripIncludes() {

    var strip = Squint.stripIncludes;

    assert.equal( strip( '#include' ), '' );
    assert.equal( strip( '#include\n' ), '' );
    assert.equal( strip( '#include "text.h"' ), '' );
    assert.equal( strip( '#include "text.h"\n' ), '' );
    
    assert.equal( strip( '# include' ), '' );
    assert.equal( strip( '#	include\n' ), '' );
    assert.equal( strip( '# 	include "text.h"	' ), '' );
    assert.equal( strip( '#  include "text.h"	\n' ), '' );
  }

  function stripDefines() {
    var strip = Squint.stripDefines;
    
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
  }

  function stripComments() {

    var strip = Squint.stripComments;

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

    assert.equal( strip( '/*\ntext\n/*/' ), '' ); 
  }
  
  function test(f) {
    f();
    Test.finalLog( f.name + ' passed' );
  }
}
