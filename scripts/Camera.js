define(['ofio/ofio', 'glMatrix'], function (Ofio, glMatrix) {
    /**
     * @class Camera
     * @param {object} options
     * @param {number} options.fieldOfView
     * @param {number} options.ratio
     * @param {number} options.near
     * @param {number} options.far
     */
    var Camera = Ofio.extend({
        modules: arguments
    }, /**@lends Camera*/{
        /**
         * @constructor
         * @protected
         */
        _init: function () {
            this._fieldOfView = this._options.fieldOfView || 45;
            this._ratio = this._options.ratio || 1;
            this._near = this._options.near || 0.1;
            this._far = this._options.far || 100.0;

            this._perspective = null;
            this._position = null;
            this._mat4 = glMatrix.mat4;

            this._initPerspective();
            this._initPosition();
        },

        _initPerspective: function () {
            var perspective = this._perspective = this._mat4.create();
            this._mat4.perspective(perspective, this._fieldOfView, this._ratio, this._near, this._far);
        },

        _initPosition: function () {
            var position = this._position = this._mat4.create();
            this._mat4.identity(position);

        },

        /**
         * @public
         * @param {Array.<number>} v
         */
        translate: function (v) {
            this._mat4.translate(this._position, this._position, v);
        },

        /**
         * @public
         * @returns {Float32Array}
         */
        getPerspective: function () {
            return new Float32Array(this._perspective);
        },

        /**
         * @public
         * @returns {Float32Array}
         */
        getPosition: function () {
            return new Float32Array(this._position);
        }
    });

    return Camera;
});