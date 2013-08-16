define(['ofio/ofio'], function (Ofio) {
    /**
     * @class Shape
     */
    var Shape = Ofio.extend({
        modules: arguments
    }, /**@lends Shape*/{
        /**
         * @constructor
         * @protected
         */
        _init: function () {
            this._vertices = this._options.vertices;
        },

        /**
         * @public
         * @returns {Float32Array}
         */
        getVertices: function () {
            return new Float32Array(this._vertices)
        }
    });

    return Shape;
});