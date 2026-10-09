// a) Gauss formula
const sum_to_n_a = (n) => {
  return (n * (n + 1)) / 2;
};

// b) Iterative loop
const sum_to_n_b = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
};

// c) Recursive
const sum_to_n_c = (n) => {
  if (n <= 0) return 0;
  if (n % 2 === 0) {
    const half = n / 2;
    return 2 * sum_to_n_c(half) + half * half;
  }
  return sum_to_n_c(n - 1) + n;
};
