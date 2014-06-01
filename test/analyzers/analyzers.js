#!/usr/bin/env node

var cp = require( 'child_process' );

cp.fork( 'scoper', [], { cwd: 'analyzers/' } );
cp.fork( 'definer', [], { cwd: 'analyzers/' } );
cp.fork( 'declarer', [], { cwd: 'analyzers/' } );
cp.fork( 'template', [], { cwd: 'analyzers/' } );
cp.fork( 'preprocessor', [], { cwd: 'analyzers/' } );
