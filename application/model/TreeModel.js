

export function createTree(name, ...children) {
    return {
        name: name,
        children: children
    }
}

export function createTestTree() {
    let tree = createTree;
    return tree("foo",
        tree("fie",
            tree("fum",
                tree("bar"),
                tree("foobar")
            ),
            tree("x"),
            tree("y")
        )
    );
} 


// export class TreeModel {
//     constructor() {

//     }
// }