class Model {
    copyProps(keys, values) {
        keys.map(
            (c) => values.hasOwnProperty(c)
                && ( this[c] = values[c] )
        );
    }
}

export default Model;