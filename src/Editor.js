import React, {Component} from 'react';
import './Editor.css';
import * as d3 from "d3";

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.svg = null;
    }

    componentDidMount() {
        this.drawChart();
    }

    componentWillUnmount() {
        d3.select(".Editor").remove(this.svg);
    }

    drawChart() {
        const components = [
            {
                name: "Primary Cloud",
                space: {from: {x: 0, y: 0, z: 0}, to: {x: 200, y: 240, z: 200}},
                surface: {color: '#11AA33', opacity: 0.1},
                children: [
                    {
                        name: "VI",
                        space: {from: {x: 0, y: 0, z: 0}, to: {x: 200, y: 80, z: 200}},
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
                space: {from: {x: 200, y: 0, z: 0}, to: {x: 400, y: 240, z: 200}},
                surface: {color: '#1133AA', opacity: 0.2},
                children: []
            }
        ];

        const links = [];

        this.svg = d3.select(".Editor").append("svg")
                     .attr("width", 1400).attr("height", 600);

        this.drawBox(components[0].space, components[0].surface);
        this.drawBox(components[1].space, components[1].surface);
    }

    render() {
        return <div className="Editor"/>
    }

    drawBox(space, surface) {
        const origin = {x: 400, y: 300};
        const v = {x: -0.5, y: -0.2};
        let {from, to} = space;
        let parallelograms = [
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
            ],
        ];

        // reverse for to bottom up
        parallelograms = parallelograms.map(pl => pl.map(p => ({x: p.x, y: (p.y * -1)})));
        this.svg.selectAll("polygon.p" + Math.floor(Math.random() * 10000))
            .data(parallelograms)
            .enter()
            .append("polygon")
            .attr("points", d => d.map(p => (p.x + origin.x) + ',' + (p.y + origin.y)).join(' '))
            .attr("fill", surface.color)
            .attr("stroke", 'darkgray')
            .attr("fill-opacity", surface.opacity);
    }
}
