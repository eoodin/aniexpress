import React, {Component} from 'react';

import './Editor.css';
import * as d3 from "d3";

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.svg = null;
        this.boxes = [];
        this.state = {zFactor: {x: -0.5, y: -0.2}};
    }

    componentDidMount() {
        this.svg = d3.select(".Editor").append("svg").attr("width", 800).attr("height", 600);

        const components = [
            {
                name: "Primary Cloud",
                space: {from: {x: 0, y: 0, z: 0}, to: {x: 200, y: 240, z: 200}},
                surface: {color: '#11AA33', opacity: 0.1},
                children: [
                    {
                        name: "VI",
                        space: {from: {x: 5, y: 5, z: 5}, to: {x: 195, y: 75, z: 195}},
                        surface: {color: '#118822', opacity: 1.0},
                        children: [
                            {
                                name: "Disk",
                                space: {from: {x: 10, y: 0, z: 80}, to: {x: 90, y: 80, z: 120}}
                            }
                        ]
                    }
                ]
            },
            {
                name: "Backup Cloud",
                space: {from: {x: 240, y: 0, z: 0}, to: {x: 440, y: 240, z: 200}},
                surface: {color: '#1133AA', opacity: 0.2},
                children: []
            }
        ];
        this.drawBox(components[0].space.from, components[0].space.to, components[0].surface);
        this.drawBox(components[1].space.from, components[1].space.to, components[1].surface);
        this.drawBox(components[0].children[0].space.from, components[0].children[0].space.to, components[0].children[0].surface);

        this.updateChart();
    }

    componentWillUnmount() {
        d3.select(".Editor").remove(this.svg);
    }

    changeZx(x) {
        this.setState({zFactor: {... this.state.zFactor, x: x}});
    }

    changeZy(y) {
        this.setState({zFactor: {... this.state.zFactor, y: y}});
    }

    render() {
        this.updateChart();
        return <div className="Editor">
            <div className="controls">
                <div>
                    <label> Zx-rotate: {this.state.zFactor.x}
                        <input type="range" max="1" min="-1" step="0.01" value={this.state.zFactor.x}
                               onChange={e => this.changeZx(e.target.value)}/>
                    </label>
                </div>
                <div>
                    <label> Zy-rotate: {this.state.zFactor.y}
                        <input type="range" max="1" min="-1" step="0.01" value={this.state.zFactor.y}
                               onChange={e => this.changeZy(e.target.value)}/>
                    </label>
                </div>
            </div>
        </div>
    }

    drawBox(from, to, surface) {
        let id;
        do {
            id = Math.floor(Math.random() * 1000000);
        } while (this.boxes.some(b => b.id === id));

        this.boxes.push({id: id, from: from, to: to, surface: surface})
    }

    updateChart() {
        if (!this.svg) {
            return;
        }

        const origin = {x: 300, y: 400};
        let all = this.svg && this.svg.selectAll('polygon');
        all && all.remove();
        // reverse for to bottom up
        for (let id in this.boxes) {
            let b = this.boxes[id];
            let faces = this.getBoxFaces(b);
            let parallelograms = faces.map(pl => pl.map(p => ({x: p.x, y: (p.y * -1)})));
            this.svg.selectAll("polygon.p" + b.id)
                .data(parallelograms)
                .enter()
                .append("polygon")
                .attr("points", d => d.map(p => (p.x + origin.x) + ',' + (p.y + origin.y)).join(' '))
                .attr("fill", b.surface.color)
                .attr("stroke", 'darkgray')
                .attr("fill-opacity", b.surface.opacity);
        }
    }

    getBoxFaces(b) {
        const v = this.state.zFactor;
        let {from, to} = b;
        return [
            [ // back
                {x: from.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: to.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: to.x + from.z * v.x, y: to.y + from.z * v.y},
                {x: from.x + from.z * v.x, y: to.y + from.z * v.y}
            ],
            [ // bottom
                {x: from.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: to.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: to.x + to.z * v.x, y: from.y + to.z * v.y},
                {x: from.x + to.z * v.x, y: from.y + to.z * v.y}
            ],
            [ // front
                {x: from.x + to.z * v.x, y: from.y + to.z * v.y},
                {x: to.x + to.z * v.x, y: from.y + to.z * v.y},
                {x: to.x + to.z * v.x, y: to.y + to.z * v.y},
                {x: from.x + to.z * v.x, y: to.y + to.z * v.y}
            ],
            [// left
                {x: from.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: from.x + to.z * v.x, y: from.y + to.z * v.y},
                {x: from.x + to.z * v.x, y: to.y + to.z * v.y},
                {x: from.x + from.z * v.x, y: to.y + from.z * v.y}
            ],
            [// right
                {x: to.x + from.z * v.x, y: from.y + from.z * v.y},
                {x: to.x + to.z * v.x, y: from.y + to.z * v.y},
                {x: to.x + to.z * v.x, y: to.y + to.z * v.y},
                {x: to.x + from.z * v.x, y: to.y + from.z * v.y}
            ],
            [ // top
                {x: from.x + from.z * v.x, y: to.y + from.z * v.y},
                {x: to.x + from.z * v.x, y: to.y + from.z * v.y},
                {x: to.x + to.z * v.x, y: to.y + to.z * v.y},
                {x: from.x + to.z * v.x, y: to.y + to.z * v.y}
            ]
        ];
    }
}
