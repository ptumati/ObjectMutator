'use strict';

let {expect} = require('chai');
let Mutator = require( '../index.js' );

describe( '#Mutator', function() {
    let baseObject = {
        a: 0,
        b: 0,
        c: 0,
        d: "Unmutated property"
    };
    
    let mutationGroup = [
        { targetKey: "a", start: 5, checkRange: (i) => (i < 10 ), step: (i) => i+1 },
        { targetKey: "b", start: 10, checkRange: (i) => ( i < 20 ), step: (i) => i+2 },
        { targetKey: "c", start: -10, checkRange: (i) => ( i < 0 ), step: (i) => i+1 }
    ];

    it( 'should leave unmutated properties untouched', function() {
        let expectedTotal = 5 * 5 * 10;
        let mutationBag = new Mutator( baseObject, mutationGroup );
        let result = 0;
        mutationBag.mutations.forEach(element => {
            if( element.d === 'Unmutated property' ) result++;
        });

        expect( result ).to.equal( expectedTotal );
    });

    // TODO:  Can do better on this test
    it( 'should filter out unwanted mutations', function() {
        let mutationBag = new Mutator( baseObject, mutationGroup, (mutation) => { 
            return( mutation.a >= 7 ) 
        });

        expect( mutationBag.mutations.length ).to.equal( 150 );    
    });
});
