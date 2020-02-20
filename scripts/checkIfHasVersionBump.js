const shell = require("shelljs")

shell.exec("git fetch origin master && git diff origin/master -- package.json",{silent: true}, (code, stdout, stderr) => {
    if (stdout.includes("\"versiddon\":")) {
        console.log("Has version upgrade, perfect")
    } else {
        throw new Error("You need to upgrade the version number")
    }
})
