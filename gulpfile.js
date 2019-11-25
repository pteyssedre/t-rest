const {src, dest, series} = require("gulp");
const gClean = require("gulp-clean");
const typescript = require("gulp-typescript");
const tsProject = typescript.createProject("tsconfig.json");

function compile() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(dest("./"));
}

function clean() {
    return src(
        [
            "src/**/*.js",
            "src/**/*.d.ts",
            "dist/**/*.js",
            "dist/**/*.d.ts",
            "test/**/*.d.ts",
            "test/**/*.js",
        ], {read: false},
    ).pipe(gClean());
}

exports.clean = clean;
exports.compile = compile;
exports.default = series(clean, compile);
