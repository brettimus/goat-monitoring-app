module.exports = {
    nTimes,
};

function nTimes(n, f) {
    while (n--) f();
}