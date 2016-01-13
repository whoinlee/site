/**
 * Created by IntelliJ IDEA.
 * User: WhoIN
 * Date: 5/21/13
 * Time: 9:25 PM
 * To change this template use File | Settings | File Templates.
 */
var glUtils = {
    glContextNames: ["webgl","experimental-webgl","webkit-3d","moz-webgl"],
    getAnimTime: function() { //in a cross browser way
        if (this.canvasNativeFrameTimesSupported()) {
            return (window.animationStartTime || window.mozAnimationStartTime);
        }
        return (new Date() - 0);
    //    return window.animationStartTime || window.mozAnimationStartTime || (new Date() - 0);
    },
    getGLContext: function(cId) {
        var gl = null;
        var canvas = document.getElementById(cId);
        if (!canvas) {
            gl = false;
            return gl;
        }
        for (var i = 0; i < this.glContextNames.length; ++i) {
            try {
                gl = canvas.getContext(this.glContextNames[i]);//,{antialias: true}
            } catch(e) {};
            if (gl) break;
        }
        return gl;
    },
    getShader: function(gl, id) {
        var script = document.getElementById(id);
        if (!script) {
            return null;
        }
        var str = "";
        var k = script.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        var shader;
        if (script.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (script.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    },
    createShader: function(gl, str, type) {
        var shader;
        if (type == "fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    },
    calculateNormals: function(vs, ind) {
        var x=0;
        var y=1;
        var z=2;

        var ns = [];
        for(var i=0;i<vs.length;i++){ //for each vertex, initialize normal x, normal y, normal z
            ns[i]=0.0;
        }

        for(var i=0;i<ind.length;i=i+3){ //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
            var v1 = [];
            var v2 = [];
            var normal = [];
            //p1 - p0
            v1[x] = vs[3*ind[i+1]+x] - vs[3*ind[i]+x];
            v1[y] = vs[3*ind[i+1]+y] - vs[3*ind[i]+y];
            v1[z] = vs[3*ind[i+1]+z] - vs[3*ind[i]+z];
            //p2 - p1
            v2[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
            v2[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
            v2[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];

            //cross product by Sarrus Rule
            normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
            normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
            normal[z] = v1[x]*v2[y] - v1[y]*v2[x];

            for(j=0;j<3;j++){ //update the normals of that triangle: sum of vectors
                ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
                ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
                ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
            }
        }
    //console.log(ns);
        //normalize the result
        for(var i=0;i<vs.length;i=i+3){ //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
            var nn=[];
            nn[x] = ns[i+x];
            nn[y] = ns[i+y];
            nn[z] = ns[i+z];

            var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
            if (len == 0) len = 0.00001;

            nn[x] = nn[x]/len;
            nn[y] = nn[y]/len;
            nn[z] = nn[z]/len;

            ns[i+x] = nn[x];
            ns[i+y] = nn[y];
            ns[i+z] = nn[z];
        }
    //console.log(ns);

        return ns;
    },
    generateSphereData: function(radius, latCount, lngCount) { /* for TRIANGLE mode */
        var vertices = [];
        var indices = [];
        var normals = [];
        var textureCoords = [];
        var latNumber = 0;
        var lngNumber = 0;
        var x,y,z,theta,sinTheta,cosTheta,phi,sinPhi,cosPhi,firstI,secondI,u,v;
        for (latNumber = 0; latNumber <= latCount; latNumber++) {
            theta = latNumber*Math.PI/latCount;
            sinTheta = Math.sin(theta);
            cosTheta = Math.cos(theta);
            y = cosTheta;
            for (lngNumber = 0; lngNumber <= lngCount; lngNumber++) {
                phi = lngNumber * 2 * Math.PI / lngCount;
                sinPhi = Math.sin(phi);
                cosPhi = Math.cos(phi);

                x = cosPhi * sinTheta;
                z = sinPhi * sinTheta;
                vertices.push(radius * x);
                vertices.push(radius * y);
                vertices.push(radius * z);
                normals.push(x);
                normals.push(y);
                normals.push(z);

                u = 1-(lngNumber / lngCount);
                v = latNumber / latCount;
                textureCoords.push(u);
                textureCoords.push(v);

                if ((latNumber<latCount) && (lngNumber<lngCount)) {
                    firstI = (latNumber * (lngCount + 1)) + lngNumber;
                    secondI = firstI + lngCount + 1;
                    indices.push(firstI);
                    indices.push(secondI);
                    indices.push(firstI + 1);
                    indices.push(secondI);
                    indices.push(secondI + 1);
                    indices.push(firstI + 1);
                }

            }
        }
        return {'vertices':vertices, 'indices':indices, 'normals': normals, 'textureCoords': textureCoords};
    },
    generateSphereMeshData: function(radius, latCount, lngCount) {
        var vertices = [];
        var indices = [];
        var normals = [];
        var latNumber = 0;
        var lngNumber = 0;
        var x,y,z,theta,sinTheta,cosTheta,phi,sinPhi,cosPhi,firstI,secondI;
        for (latNumber = 0; latNumber <= latCount; latNumber++) {
            theta = latNumber*Math.PI/latCount;
            sinTheta = Math.sin(theta);
            cosTheta = Math.cos(theta);
            y = cosTheta;
            for (lngNumber = 0; lngNumber <= lngCount; lngNumber++) {
                phi = lngNumber * 2 * Math.PI / lngCount;
                sinPhi = Math.sin(phi);
                cosPhi = Math.cos(phi);
                x = cosPhi * sinTheta;
                z = sinPhi * sinTheta;
                vertices.push(radius * x);
                vertices.push(radius * y);
                vertices.push(radius * z);
                normals.push(x);
                normals.push(y);
                normals.push(z);
                if ((latNumber<latCount) && (lngNumber<lngCount)) {
                    firstI = (latNumber * (lngCount + 1)) + lngNumber;
                    secondI = firstI + lngCount + 1;
                    indices.push(firstI);
                    indices.push(secondI);
                    indices.push(firstI);
                    indices.push(firstI + 1);
                    indices.push(firstI + 1);
                    indices.push(secondI + 1);
                    indices.push(secondI + 1);
                    indices.push(secondI);
                }
            }
        }
        return {'vertices':vertices, 'indices':indices, 'normals': normals};
    },
    generateSphereMeshLats: function(radius, size) {
        var latCount = Math.floor(Math.PI*radius/size);
        var latObjs = [];
        var latNumber, obj;
        for (latNumber = 1; latNumber < latCount; latNumber++) {
            obj = this.generateMeshLat(latNumber, latCount, radius, size);
            latObjs.push(obj);
        }
        return latObjs;
    },
    generateMeshLat: function(latNumber, latCount, radius, size) {
        var theta = latNumber*Math.PI/latCount;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var x,z;
        var y = cosTheta;
        var lngNumber, phi, sinPhi, cosPhi;
        var lngCount = Math.floor(2*Math.PI*radius*sinTheta/size);
        var obj = {
            vertices: [], indices: [], normals: [],
            ambient: [1.0,0.0,0.0,1.0],
            mMatrix: mat4.identity(),
            aMatrix: mat4.identity(),
            vbo: null, ibo: null, nbo: null, tbo: null,
            drawMethod: 'lines',
            name: 'meshLat'+latNumber
        };


        for (lngNumber = 0; lngNumber < lngCount; lngNumber++) {
            phi = lngNumber * 2 * Math.PI / lngCount;
            sinPhi = Math.sin(phi);
            cosPhi = Math.cos(phi);
            x = cosPhi * sinTheta;
            z = sinPhi * sinTheta;
            obj.vertices.push((radius+5) * x);
            obj.vertices.push((radius+5) * y);
            obj.vertices.push((radius+5) * z);
            obj.vertices.push(radius * x);
            obj.vertices.push(radius * y);
            obj.vertices.push(radius * z);

            obj.indices.push(lngNumber*4);
            obj.indices.push(lngNumber*4+1);


            obj.vertices.push(radius * x - 5*sinPhi);
            obj.vertices.push(radius * y);
            obj.vertices.push(radius * z + 5*cosPhi);
            obj.vertices.push(radius * x + 5*sinPhi);
            obj.vertices.push(radius * y);
            obj.vertices.push(radius * z - 5*cosPhi);
            obj.indices.push(lngNumber*4+2);
            obj.indices.push(lngNumber*4+3);

            obj.normals.push(0);obj.normals.push(0);obj.normals.push(0);
            obj.normals.push(0);obj.normals.push(0);obj.normals.push(0);
            obj.normals.push(0);obj.normals.push(0);obj.normals.push(0);
            obj.normals.push(0);obj.normals.push(0);obj.normals.push(0);


        }

        return obj;
    },
    generateCircleData: function(radius, segCount, axisNormalVal, axisNormal/*x,y,z*/) { /* for LINE_LOOP mode */
        var vertices = [];
        var indices = [];
        var normals = [];
        var i,a;
        var z = axisNormalVal;
        for (i=0; i<segCount; i++) {
            a = i*2*Math.PI/segCount;
            x = radius * Math.cos(a);
            y = radius * Math.sin(a);
            vertices.push(x); vertices.push(y); vertices.push(z);
            normals.push(0); normals.push(0); normals.push(0);
            indices.push(i);
        }

        return {'vertices':vertices, 'indices':indices, 'normals': normals};
    },
    getMousePos: function(e) {
        var x, y;
        if (e.layerX || e.layerX == 0) {
            x = e.layerX;
            y = e.layerY;
        } else if (e.offsetX || e.offsetX == 0) {
            x = e.offsetX;
            y = e.offsetY;
        }
        return {'x': x, 'y': y};
    },
    easeOutQuad: function(dt0, f0, destFX, d) {
        if (dt0>=d) return destFX + f0;
        return -destFX *(dt0/=d)*(dt0-2) + f0;
    },
    canvasNativeFrameTimesSupported: function() {
        var nativeRequestFrameFunc =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        return (nativeRequestFrameFunc && (window.animationStartTime || window.mozAnimationStartTime))?true:false;
    },
    getCanvasRequestAnimFrameFunc: function() {
        if (this.canvasNativeFrameTimesSupported()) {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame;
        }
        return function(callback) {
            window.setTimeout(function() {callback(new Date() - 0);}, 1000/60);
        };
    }
};
//in a cross browser way
var canvasRequestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000/60);
    };
})();