define(['ofio/ofio', 'Camera'], function (Ofio, Camera) {
    /**
     * @class Scene
     */
    var Scene = Ofio.extend({
        modules: arguments
    }, /**@lends Scene*/{
        /**
         * @constructor
         * @protected
         */
        _init: function () {
            this._super();

            this._canvas = this._options.canvas;
            this._gl = null;
            this._programm = null;
            this._camera = null;

            this._initGL();
            this._initProgram();
            this._initCamera();
        },

        _initGL: function () {
            var canvas = this._canvas;
            try {
                this._gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            } catch (e) {
                console.error('Unable to initialize WebGL.');
                throw e;
            }
        },

        _initProgram: function () {
            this._program = this._gl.createProgram();
        },

        _initCamera: function () {
            this._camera = new Camera({
                ratio: this._canvas.width / this._canvas.height
            });
        },

        /**
         * @public
         * @returns {Camera}
         */
        getCamera: function () {
            return this._camera;
        },

        /**
         * @param {String} shaderSource
         * @returns {Scene} this
         * @public
         */
        attachFragmentShader: function (shaderSource) {
            return this._attachShader(shaderSource, this._gl.FRAGMENT_SHADER);
        },

        /**
         * @param {string} shaderSource
         * @returns {Scene}
         * @public
         */
        attachVertexShader: function (shaderSource) {
            return this._attachShader(shaderSource, this._gl.VERTEX_SHADER);
        },

        /**
         * @param {String} shaderSource
         * @param {number} shaderType
         * @returns {Scene} this
         * @private
         */
        _attachShader: function (shaderSource, shaderType) {
            var gl = this._gl,
                shader = gl.createShader(shaderType);

            gl.shaderSource(shader, shaderSource);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                return null;
            }

            gl.attachShader(this._program, shader);
            return this;
        },

        /**
         * @param {Shape} shape
         * @returns {Scene} this
         */
        addShape: function (shape) {
            var gl = this._gl,
                buffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, shape.getVertices(), gl.STATIC_DRAW);

            return this;
        },

        /**
         * @public
         * @returns {Scene}
         */
        draw: function () {
            var gl = this._gl;

            if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
                this._prepare();
            }

            this.clear();
            this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
            return this;
        },

        _prepare: function () {
            this._prepareProgram();

            var gl = this._gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);

            gl.vertexAttribPointer(null, 3, gl.FLOAT, false, 0, 0);

            var pUniform = gl.getUniformLocation(this._program, "uPMatrix");
            gl.uniformMatrix4fv(pUniform, false, this._camera.getPerspective());

            var mvUniform = gl.getUniformLocation(this._program, "uMVMatrix");
            gl.uniformMatrix4fv(mvUniform, false, this._camera.getPosition());
        },

        _prepareProgram: function () {
            var gl = this._gl,
                program = this._program;

            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error('Unable to link program');
            }
            gl.useProgram(program);

            var vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
        },

        clear: function () {
            var gl = this._gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
    });

    return Scene;
});


