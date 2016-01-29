var choices = [
	{rarity: 1, result: "a"},
	{rarity: 1, result: "b"},
	{rarity: 2, result: "c"},
];

function pick(choices) {
	var total = 0;

	for (var i = 0, count = choices.length; i < count; i += 1) {
		var item = choices[i];
		item.fraction = 1 / choices[i].rarity;
		total += item.fraction;
	}

	var sum = 0;
	var random = Math.random();
	for (var i = 0, count = choices.length; i < count; i += 1) {
		var item = choices[i];
		var chance = item.fraction / total;
		sum += chance;
		if (random < sum) {
			return item.result;
		}
	}
	return item.result;	
}

var results = {a: 0, b: 0, c:0};
for (var i = 0; i < 1000; i += 1) {
	results[pick(choices)] += 1
}

console.log(results);
