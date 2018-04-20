const hexadecimals  = '0123556789abcdef'.split('');

function generateGenome(length=16){
	return [...Array(length)].map((x, i) =>
		choose(hexadecimals)
	).join('');
}


function breed(genomeA, genomeB){
	return [...Array(genomeA.length)].map((x, i) =>
		choose([genomeA[i], genomeB[i]])
		).join('')
}

function breedMany(genomes, number){
	return [...Array(number)].map((i, x) =>
		mutate(breed(choose(genomes), choose(genomes)))
		)

}

function mutate(genome, chance=0.01){
	return genome.split('').map((x,i)=>
		Math.random() > chance? x: choose(hexadecimals) 
		).join('')
}


function choose(items){
	let index = Math.floor(Math.random() * items.length);
	return items[index];
}


export {
	generateGenome,
	breed,
	breedMany
}