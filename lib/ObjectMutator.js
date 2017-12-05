/**
 * @fileOverview File contains the definitions for the Mutator class
 * @author <a href="mailto:pavan.github@tumati.net">Pavan Tumati</a
 * @version 1.0.0
 * @name ObjectMutator
 */

 /**
  * @class Mutator
  * @classdesc Provides the mutator class that lets you generate all possible mutations specified in a mutation group
  */
class Mutator {
    /**
     * @constructs Mutator
     * @description Constructs mutator object
     * @param {baseObject} The base object that gets mutated
     * @param {mutationGroup} The set of (joint) mutations to apply to a baseObject
     * @param {cullFunction} The function passed to a filter to remove any invalid/unwanted mutations to the baseObject
     */
    constructor( baseObject, mutationGroup, cullFunction ) {
        this.mutations = [];     
        this.baseObject = baseObject;

        this.assertKeysToMutatePresent( mutationGroup );
        function generateMutations( chromosome, mutationGroup ) {
            function internalGenerateMutations( mutationGroup ) {
                let mutationGroupClone = mutationGroup.slice(0);
                let frameObject = mutationGroupClone.shift();
                
                let nextGeneration = [];
                for( let i = frameObject.start; frameObject.checkRange(i); i = frameObject.step(i) ) {
                    if( mutationGroupClone.length > 0 ) {
                        let subMutations = internalGenerateMutations( mutationGroupClone );
                        nextGeneration.push.apply( nextGeneration, subMutations.map( (submutation ) => {
                            submutation[ frameObject.targetKey ] = i;
                            return submutation;
                        }));
                    } else {
                        let mutation = {};
                        mutation[ frameObject.targetKey ] = i;
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
            generateMutations( baseObject, mutationGroup ).filter( cullFunction ) :
            generateMutations( baseObject, mutationGroup );
    }

    /**
     * @function assertGenesToMutatePresent
     * @memberOf Mutator
     * 
     * @param {mutationGroup} Mutation group that needs to be checked
     */
    assertKeysToMutatePresent( mutationGroup ) {
        mutationGroup.forEach(element => {
            if( !this.baseObject.hasOwnProperty( element.targetKey ) )
                throw Error( `Missing gene ${ element.targetKey }` );
        });
    }
};

module.exports = Mutator;
