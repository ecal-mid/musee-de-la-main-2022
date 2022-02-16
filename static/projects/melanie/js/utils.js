function map(num, start1, stop1, start2, stop2) {
  return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function trueModulo(num, mod) {
  return ((num % mod) + mod) % mod; //modulo operator, same as js remainder. but works with negative numbers.
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
