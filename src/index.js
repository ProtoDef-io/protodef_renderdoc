import './test.scss';

import tablegen from './tablegen';
import { spec_to_table } from './spec_to_table';

import React from 'react';
import ReactDOM from 'react-dom';
import ferch from 'whatwg-fetch';
import _ from 'lodash';
import Remarkable from 'remarkable';

let md = new Remarkable();
let root = document.getElementById("root");

function Main({ data }) {
    let ns_sorted = _.sortBy(data.namespaces, ns => ns.path);
    let nss = _.map(ns_sorted, ns => <Namespace key={ns.path} data={ns} />);
    return <div className="root">
        <div className="toc"><TOC namespaces={ns_sorted} /></div>
        <div className="main">
            {nss}
            <div className="bottom-cover"></div>
        </div>
    </div>;
}

function  TOC({ namespaces }) {
    return <ul>
        {
            _.map(namespaces, ns => {
                return [
                    <li className="namespace"><a>{ns.path}</a></li>,
                    _.map(ns.types, type => {
                        return <li className="type">
                            <a href={"#" + type.path + type.name}>{type.name}</a>
                        </li>;
                    })
                ];
            })
        }
    </ul>;
}

function Namespace({ data }) {
    let types = _.map(data.types, typ => <Type key={typ.name} data={typ} />);
    return <div>
        <h1>{data.path}</h1>
        {types}
    </div>;
}

function Type({ data }) {
    let spec = null;
    if (data.spec.kind == "spec") {
        spec = <Spec spec={data.spec.spec} />;
    }

    return <div>
        <h3 id={data.path + data.name}>{data.name}</h3>
        <Markdown content={data.doc} />
        {spec}
    </div>;
}

function Markdown({ content }) {
    return <span dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
}

function Spec({ spec }) {
    let tableTemplate = spec_to_table(spec);

    let rows = _.map(tableTemplate, row => {
        let cols = _.map(row, col => {
            let inner = col.inner;
            let res = null;

            if (inner.type == "builtin") {
                res = <div>
                    {inner.parent_label && [inner.parent_label, <br/>]}
                    {inner.name}
                </div>;
            } else if (inner.type == "path") {
                res = <div>
                    {inner.parent_label && [inner.parent_label, <br/>]}
                    <a href={"#" + inner.path}>{inner.path}</a>
                </div>;
            }

            return <td rowSpan={col.rows} colSpan={col.cols}>
                {res}
            </td>;
        });
        return <tr>{cols}</tr>;
    });

    return <div>
        <table>
            <tbody>
                {rows}
            </tbody>
        </table>
    </div>;
}

ReactDOM.render(
    <h1>Loading...</h1>,
    root
);

fetch('spec.json').then((response) => {
    if (!response.ok) {
        ReactDOM.render(<h1>Error</h1>, root);
        return;
    }
    return response.json();
}).then((data) => {
    ReactDOM.render(
        <Main data={data}/>,
        root
    );
});
