/*
  A basic example demonstrating the idea behind applying a 
  language-theoretic approach for security analysis
*/

const express = require('express');
const child_process = require('child_process');
const parse = require('bash-parser');
const util = require('util');

const app = express();
const port = 9000;
const original_exec = child_process.exec;

// Monkey patching the 'exec' function to parse and analyse the 
// CLI input before its being executed
child_process.exec = function(command, handler){
    const ast = parse(command);

    if(ast.commands.length > 1)
        console.log(`[*] Executing more than one command: ${ast.commands.length}` );

    ast.commands.forEach( (command) => {
        command.suffix.forEach((suffix) => {
            if(suffix.hasOwnProperty("expansion")){
                suffix.expansion.forEach((expansion) => {
                    if(expansion.type === "CommandExpansion")
		        console.log(`[*] Command starts a subshell: ${command.name.text} ${suffix.text}`);
                });
            }
        });
    });    

    console.log('[*] Abstract Syntax Tree:'); 
    console.log(util.inspect(ast, false, 23, true));

    original_exec(command, handler);
};

app.get('/ping/:host', (req, res) => {
    child_process.exec(`ping -c 3 ${req.params.host}`, (error, stdout, stderr) => {
        return res.send(stdout);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
