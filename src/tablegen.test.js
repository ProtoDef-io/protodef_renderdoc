import { TableCell, HORIZONTAL, VERTICAL } from './tablegen';

test("simple cells", () => {
    let n1 = new TableCell(HORIZONTAL);
    n1.addTerminal("test1");
    let n2 = n1.addCell(VERTICAL);
    n2.addTerminal("test2");
    n2.addTerminal("test3");

    expect(n1.toOutput()).toMatchSnapshot();
});

test("advanced cells 1", () => {
    let n1 = new TableCell(HORIZONTAL);
    n1.addTerminal("test1");
    let n2 = n1.addCell(VERTICAL);
    n2.addTerminal("test2");
    let n3 = n2.addCell(HORIZONTAL);
    n3.addTerminal("test3");
    let n4 = n3.addCell(VERTICAL);
    n4.addTerminal("test4");
    let n5 = n4.addCell(HORIZONTAL);
    n5.addTerminal("test5");
    n5.addTerminal("test6");

    expect(n1.toOutput()).toMatchSnapshot();
});

test("advanced cells 2", () => {
    let n1 = new TableCell(HORIZONTAL);
    n1.addTerminal("test1");
    let n2 = n1.addCell(VERTICAL);
    n2.addTerminal("test2");
    let n3 = n2.addCell(HORIZONTAL);
    n3.addTerminal("test3");
    let n4 = n3.addCell(VERTICAL);
    n4.addTerminal("test4");
    let n5 = n4.addCell(VERTICAL);
    n5.addTerminal("test5");
    n5.addTerminal("test6");

    expect(n1.toOutput()).toMatchSnapshot();
});

test("advanced cells 3", () => {
    let n1 = new TableCell(HORIZONTAL);
    n1.addTerminal("test1");
    let n2 = n1.addCell(VERTICAL);
    n2.addTerminal("test2");
    let n3 = n2.addCell(HORIZONTAL);
    n3.addTerminal("test3");
    let n4 = n3.addCell(VERTICAL);
    n4.addTerminal("test4");
    let n5 = n4.addCell(VERTICAL);
    n5.addTerminal("test5");
    n5.addTerminal("test6");
    n3.addTerminal("test7");

    expect(n1.toOutput()).toMatchSnapshot();
});
