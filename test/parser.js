var assert = require( 'assert' )
  , Parser = require( 'parser' ).Parser;

testNested();
testInterleaved();
testScopes();
testStatments();

function testNested() {
  var parser = new Parser( this );
  
  this.emit = function( event, name ) {
    assert.equal( event, 'open' );
    assert.equal( name, 'a' );
    this.emit = function( event, name ) {
      assert.equal( event, 'open' ); 
      assert.equal( name, 'b' ); 
      this.emit = function( event, name ) {
        assert.equal( event, 'statement' );
        assert.equal( name, 'c' ); 
        this.emit = function( event ) {
          assert.equal( event, 'close' );
          this.emit = function( event ) {
            assert.equal( event, 'close' );
            this.emit = assert.fail;
          }; 
        };
      };
    };
  }; 

  parser.process( 'a { b { c; } }' );
};

function testInterleaved() { 
  var parser = new Parser( this );
  
  this.emit = function( event, name ) {
    assert.equal( event, 'open' );
    assert.equal( name, 'a' );
    this.emit = function( event, name ) {
      assert.equal( event, 'statement' );
      assert.equal( name, 'b' );
      this.emit = function( event ) {
        assert.equal( event, 'close' );
        this.emit = assert.fail;
      };
    }
  }; 
  
  parser.process( 'a{ b; }' );
}

function testScopes() {
  var parser = new Parser( this );
  
  this.emit = function( event, name ) {
    assert.equal( event, 'open' );
    assert.equal( name, 'a' );
    this.emit = function( event ) {
      assert.equal( event, 'close' );
      this.emit = function( event, name ) {
        assert.equal( event, 'open' );
        assert.equal( name, 'b' );
        this.emit = function( event ) { 
          assert.equal( event, 'close' );
          this.emit = function( event, name ) { 
            assert.equal( event, 'open' );
            assert.equal( name, 'c' );
            this.emit = function( event ) { 
              assert.equal( event, 'close' );
              this.emit = assert.fail;
            };
          };
        };
      };
    };
  };
  
  parser.process( 'a{} b{} c{}' );
}

function testStatments() {
  var parser = new Parser( this );

  this.emit = function( event, source ) {
    assert.equal( event, 'statement' );
    assert.equal( source, '1' );
  
    this.emit = function( event, source ) {
      assert.equal( event, 'statement' );
      assert.equal( source, '2' );

      this.emit = function( event, source ) {
        assert.equal( event, 'statement' );
        assert.equal( source, '3' );
        this.emit = function( event, source ) {
          assert.equal( event, 'statement' );
          assert.equal( source, "" );
          this.emit = assert.fail;
        };
      }   
    }   
  };

  parser.process( '1; 2; 3;;' );
}
