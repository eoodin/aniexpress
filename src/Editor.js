import React, {Component} from 'react';

import './Editor.css';
import * as THREE from 'three';

export default class Editor extends Component {
    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.setState({zFactor: {x: -0.5, y: -0.2}});
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            500
        );

        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0 ,0);
        //ADD RENDERER
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('webgl2');
        this.renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
        // this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        //ADD CUBE
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({color: '#433F81'});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        const geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(-10, 0, 0));
        geo.vertices.push(new THREE.Vector3(0, 10, 0));
        geo.vertices.push(new THREE.Vector3(10, 0, 0));

        const mat = new THREE.LineBasicMaterial({color: 0x0000ff});
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);

        this.start();
    }

    componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    };

    stop = () => {
        cancelAnimationFrame(this.frameId)
    };

    animate = () => {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    };

    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    };

    render() {
        return (
            <div style={{width: '100%', height: '100%'}}
                 ref={(mount) => {
                     this.mount = mount
                 }}
            />
        )
    }
}
