module.exports = { 
  average,
  capitalize,
  head, 
  tail,
  randomLoadDatum,
  roundToTenths,
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

function randomLoadDatum() {
  return {
    timestamp: new Date(),
    loadavg1: Math.random() * 2.5,
    loadavg5: Math.random() * 2.5,
    loadavg15: Math.random() * 2.5,
  };
}

function roundToTenths(n) {
  return Math.round(n * 10) / 10;
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