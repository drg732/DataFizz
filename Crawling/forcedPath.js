class ForcedPath {
    findURLforMatchString(array, match) {
        console.log('made it')
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == match) {
                return i;
            }
        }
    }
}

module.exports = ForcedPath;

