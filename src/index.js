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
    let nss = _.map(_.sortBy(data.namespaces, ns => ns.path), 
                    ns => <Namespace key={ns.path} data={ns} />);
    return <div>
        {nss}
    </div>;
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
        <h3>{data.name}</h3>
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

            let parent_label = inner.parent_label && [inner.parent_label, <br/>];

            if (inner.type == "builtin") {
                res = <div>
                    {parent_label}
                    {inner.name}
                </div>;
            } else if (inner.type == "path") {
                res = <div>
                    {parent_label}
                    {inner.path}
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
