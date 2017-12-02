Object Mutator
=========

A small library that lets you generate mutations of a Javascript object at the property level


## Usage

    Documentation is lacking, but here's a quick example of usage:

    let chromosome = {
        a: 0,
        b: 0,
        c: 0,
        d: "Unmutated property"
    };
    
    let mutationGroup = [
        { gene: "a", start: 5, checkRange: (i) => (i <= 10 ), step: (i) => i+1 },
        { gene: "b", start: 20, checkRange: (i) => ( i <= 30 ), step: (i) => i+2 },
        { gene: "c", start: -1, checkRange: (i) => ( i <= 3 ), step: (i) => i+1 }
    ];
    
    let filteredMutationBag = new Mutator( chromosome, mutationGroup, (mutation) => { 
        return( mutation.a > 7 ) 
    });
    console.log( filteredMutationBag.mutations );

    The mutations property above would contain every combination of 'chromosome' where:

        - 'a' ranges from 5 to 10, stepping by 1 *
        - 'b' ranges from 20 to 30, stepping by 2
        - 'c' ranges from -1 to 3, stepping by 1
        - 'd' remains the same in every object as it was passed in using the chromosome parameter

    (* 'a' eventually gets filtered by the 'cullFunction', where the values that were generated with a from 5 to 7 are dropped.  This is just an example!  The cullFunction is useful for making sure that, in a new generation of objects, that certain objects are removed because of invalid relationships between properties.)

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.