/**
 * Receives an array of tuples and a string to match against
 * The tuples must be in the form [label, Url] where both objects are strings
 * The target string (match) that is received must be an exact match for what you are looking for
 * If the target matches the first elements of a tuple, this returns the URL of the respective tuple
 * 
 */
class ForcedPath {
    findURLforMatchString(array, match) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == match) {
                return i;
                break;
            }
        }
    }
}

module.exports = ForcedPath;

