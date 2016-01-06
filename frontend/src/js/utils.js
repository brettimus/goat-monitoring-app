module.exports = { 
    average,
    capitalize,
    head, 
    tail,
    roundToThousandths,
};

function average(numbers) {
  if (numbers.length === 0) return null;

  return numbers.reduceRight(function(result, d, i, array) {
    const sum = result + d;
    if (i === 0) return sum / array.length;
    return sum;
  }, 0)
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function roundToThousandths(n) {
    return Math.round(n * 1000) / 1000;
}

function head(array) {
    return array[0];
}

function tail(array) {
    return array.slice(1);
}