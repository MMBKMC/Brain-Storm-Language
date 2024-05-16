function runCode() {
    const code = document.getElementById('code').value;
    const output = document.getElementById('output');

    try {
        const tokens = tokenize(code);
        const ast = parse(tokens);
        const result = interpret(ast);
        output.innerHTML = result;
    } catch (error) {
        output.innerHTML = `Error: ${error.message}`;
    }
}

function tokenize(code) {
    const tokenPattern = /\s*(=>|let|print|[-+*/=()]|\d+|"(?:\\.|[^\\"])*"|[a-zA-Z_]\w*)\s*/g;
    return code.split(tokenPattern).filter(token => token.trim().length > 0);
}

function parse(tokens) {
    let current = 0;

    function walk() {
        let token = tokens[current];

        if (/\d+/.test(token)) {
            current++;
            return { type: 'NumberLiteral', value: token };
        }

        if (/"/.test(token)) {
            current++;
            return { type: 'StringLiteral', value: token.replace(/"/g, '') };
        }

        if (/[a-zA-Z_]\w*/.test(token)) {
            if (tokens[current + 1] === '=') {
                let name = token;
                current += 2; // Skip 'name' and '='
                let value = walk();
                return { type: 'VariableDeclaration', name, value };
            }
            current++;
            return { type: 'Identifier', name: token };
        }

        if (token === 'print') {
            current++;
            return { type: 'PrintStatement', value: walk() };
        }
        if (token == 'Haley') {
            current++;
            return { type: 'Haley', value: walk() };
        }

        if (token == 'BlueEgg_000') {
            current++;
            return { type: 'BlueEgg_000', value: walk() };
        }

        if (token == "Nightmare_speakerman") {
            current++;
            return { type: 'Nightmare_speakerman', value: walk() };
        }

        if (token === '(') {
            current++;
            let expr = walk();
            current++;
            return expr;
        }

        if (token === '+' || token === '-' || token === '*' || token === '/') {
            let operator = token;
            current++;
            let left = walk();
            let right = walk();
            return { type: 'BinaryExpression', operator, left, right };
        }

        throw new TypeError('Unknown token: ' + token);
    }

    let ast = { type: 'Program', body: [] };

    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}

function interpret(ast, env = {}) {
    switch (ast.type) {
        case 'Program':
            return ast.body.map(statement => interpret(statement, env)).join('<br>');

        case 'VariableDeclaration':
            env[ast.name] = interpret(ast.value, env);
            return '';

        case 'PrintStatement':
            return `<span class="keyword">print</span> ${highlight(interpret(ast.value, env))}`;

        case 'Identifier':
            return env[ast.name];

        case 'NumberLiteral':
            return `<span class="number">${ast.value}</span>`;

        case 'StringLiteral':
            return `<span class="string">"${ast.value}"</span>`;

        case 'BinaryExpression':
            let left = parseFloat(stripTags(interpret(ast.left, env)));
            let right = parseFloat(stripTags(interpret(ast.right, env)));
            let result;
            switch (ast.operator) {
                case '+': result = left + right; break;
                case '-': result = left - right; break;
                case '*': result = left * right; break;
                case '/': result = left / right; break;
                default: throw new TypeError('Unknown operator: ' + ast.operator);
            }
            return `<span class="number">${result}</span>`;

        default:
            throw new TypeError('Unknown AST node type: ' + ast.type);
    }
}

function highlight(code) {
    if (typeof code === 'number') {
        return `<span class="number">${code}</span>`;
    }
    return code;
}

function stripTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function tokenize(code) {
    const tokenPattern = /\s*(=>|let|print|\/\/.*|[-+*/=()]|\d+|"(?:\\.|[^\\"])*"|[a-zA-Z_]\w*)\s*/g;
    return code.split(tokenPattern).filter(token => token.trim().length > 0);
}
