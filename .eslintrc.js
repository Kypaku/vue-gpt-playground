module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        // "@nuxtjs/eslint-config-typescript",
        // "plugin:nuxt/recommended",
        // "plugin:codeceptjs/recommended"
        "plugin:vue/essential",
        "@vue/standard",
        "@vue/typescript/recommended"
    ],
    plugins: [
    ],
    // add your custom rules here
    rules: {
        indent: ["warn", 4],
        "vue/script-indent": ["warn", 4, {
            baseIndent: 1,
            switchCase: 0,
            ignores: []
        }],
        camelcase: "warn",
        "no-lonely-if": "warn",
        "no-trailing-spaces": "warn",
        "no-cond-assign": "warn",
        "no-throw-literal": "warn",
        "prefer-regex-literals": "warn",
        "no-multiple-empty-lines": "warn",
        'no-unused-expressions': 'warn',
        "no-useless-escape": "warn",
        "vue/multi-word-component-names": "warn",
        "no-return-assign": "warn",
        "object-curly-spacing": "warn",
        "quote-props": "warn",
        "vue/html-indent": ["warn", 4],
        "vue/this-in-template": ["error", "never"],
        "comma-dangle": "off",
        "vue/html-self-closing": "off",
        "vue/custom-event-name-casing": "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/attributes-order": "off",
        "vue/order-in-components": "off",
        "space-before-function-paren": "off",
        "vue/no-v-model-argument": "off",
        // 'codeceptjs/no-actor-in-scenario': 2
        semi: ["warn", "always"],
        quotes: ["warn", "double"],
        "@typescript-eslint/no-unused-vars": "off",
        "no-unused-vars": "off",
        "require-await": "off",
        "no-console": "off"

    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off"
            }
        },
        {
            files: ["*.js"],
            rules: {
                "no-unused-expressions": "off",
            }
        },
    ],
};
