module.exports = {
    //运行环境
    "env": {
        "browser": true, //浏览器端
        "es2021": true  //es2021
    },
    //规则继承
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",//vue3语法规则
        "plugin:vue/vue3-essential"  //ts语法规则
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    "rules": {
    }
}
