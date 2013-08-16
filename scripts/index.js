requirejs.config({
    baseUrl: 'scripts',
    paths: {
        text: 'vendor/text',
        glMatrix: 'vendor/gl-matrix/dist/gl-matrix-min'
    }
});

requirejs(['Scene', 'Shape', 'text!shaders/main.vert', 'text!shaders/main.frag'], function (Scene, Shape, vShader, fShader) {
    /**
     * @type {Scene}
     */
    var scene = window.scene = new Scene({
        canvas: document.getElementById('scene')
    });

    var square = new Shape({
        vertices: [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ]
    });

    scene.getCamera().translate([2.0, 0.0, -4.0]);
    scene
        .attachVertexShader(vShader)
        .attachFragmentShader(fShader)
        .addShape(square)
        .draw();
});











