/**
 * @fileOverview
 * File contains the definitions for the Mutator class
 */

 /**
  * @class Mutator
  * @classdesc Provides the mutator class that lets you generate all possible mutations specified in a mutation group
  */
class Mutator {
    /**
     * @constructs Mutator
     * @description Constructs mutator object
     * @param {chromosome} The base object that gets mutated
     * @param {mutationGroup} The set of (joint) mutations to apply to a chromosome
     * @param {cullFunction} The function passed to a filter to remove any invalid/unwanted genes in the mutation set
     */
    constructor( chromosome, mutationGroup, cullFunction ) {
        this.mutations = [];     
        this.chromosome = chromosome;

        this.assertGenesToMutatePresent( mutationGroup );
        function generateMutations( chromosome, mutationGroup ) {
            function internalGenerateMutations( mutationGroup ) {
                let mutationGroupClone = mutationGroup.slice(0);
                let frameGene = mutationGroupClone.shift();
                
                let nextGeneration = [];
                for( let i = frameGene.start; frameGene.checkRange(i); i = frameGene.step(i) ) {
                    if( mutationGroupClone.length > 0 ) {
                        let subMutations = internalGenerateMutations( mutationGroupClone );
                        nextGeneration.push.apply( nextGeneration, subMutations.map( (submutation ) => {
                            submutation[ frameGene.gene ] = i;
                            return submutation;
                        }));
                    } else {
                        let mutation = {};
                        mutation[ frameGene.gene ] = i;
                        nextGeneration.push( mutation );
                    }
                }
                return nextGeneration;
            }
    
            let baseMutations = internalGenerateMutations( mutationGroup );
            return (baseMutations.map( (value) => {
                return {
                    ...chromosome,
                    ...value
                };
            }));
        };

        this.mutations = (typeof( cullFunction ) === 'function') ?
            generateMutations( chromosome, mutationGroup ).filter( cullFunction ) :
            generateMutations( chromosome, mutationGroup );
    }

    /**
     * @function assertGenesToMutatePresent
     * @memberOf Mutator
     * 
     * @param {mutationGroup} Mutation group that needs to be checked
     */
    assertGenesToMutatePresent( mutationGroup ) {
        mutationGroup.forEach(element => {
            if( !this.chromosome.hasOwnProperty( element.gene ) )
                throw Error( `Missing gene ${ element.gene }` );
        });
    }
};

module.exports = Mutator;
