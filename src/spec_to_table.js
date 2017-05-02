import _ from 'lodash';
import { TableCell, HORIZONTAL, VERTICAL } from './tablegen';

export function spec_to_table(spec) {
    let table = new TableCell(HORIZONTAL);
    spec_to_table_inner(table, spec);
    return table.toOutput();
}

function spec_to_table_inner(parent, spec, extra) {
    let root = parent.addCell(VERTICAL);
    if (!extra) extra = "";

    if (spec.kind == "container") {
        root.addTerminal({
            type: "builtin",
            name: "Container",
            parent_label: extra,
        });
        let inner_cell = root.addCell(HORIZONTAL);

        _.each(spec.fields, field => {
            spec_to_table_inner(inner_cell.addCell(HORIZONTAL), field.spec, field.name);
        });

        if (spec.fields.length == 0) {
            inner_cell.addTerminal({
                type: "empty",
            });
        }
    } else if (spec.kind == "union") {
        root.addTerminal({
            type: "builtin",
            name: "Union",
            parent_label: extra,
        });
        let inner_cell = root.addCell(HORIZONTAL);

        _.each(spec.cases, case_ => {
            spec_to_table_inner(inner_cell.addCell(HORIZONTAL), case_.spec, case_.name);
        });

        if (spec.cases.length == 0) {
            inner_cell.addTerminal({
                type: "empty",
            });
        }
    } else if (spec.kind == "array") {
        root.addTerminal({
            type: "builtin",
            name: "Array",
            parent_label: extra,
        });
        spec_to_table_inner(root.addCell(HORIZONTAL), spec.spec, null);
    } else if (spec.kind == "terminal") {
        root.addTerminal({
            type: "path",
            path: spec.path,
            parent_label: extra,
        });
    } else {
        throw "unexpected kind";
        root.addTerminal({
            type: "empty",
        });
    }
}
