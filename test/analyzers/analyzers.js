#!/usr/bin/env node

var cp = require( 'child_process' );

cp.fork( 'scoper' );
cp.fork( 'definer' );
cp.fork( 'declarer' );
cp.fork( 'template' );
cp.fork( 'preprocessor' );
