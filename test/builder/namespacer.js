#!/usr/bin/env node

var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , test = Builder.test
  , Namespacer = require( '../../src/builder/namespacer' ).Namespacer;

assert( typeof Namespacer !== 'undefined' );
