module.exports = {
  "extends": ["airbnb", "plugin:react/recommended", "plugin:jsx-a11y/recommended"],
  "plugins": [
    "jsx-a11y",
    "react"
  ],
  "parser": "babel-eslint",
  "rules": {
    "space-in-parens": "off",
    "template-curly-spacing": [2, "never"],
    "object-curly-spacing": [2, "always"],
    "object-curly-newline": "off",
    "no-use-before-define": [2, { "functions": false }],
    "semi": [2, "never"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/jsx-one-expression-per-line": [0, { "allow": "single-child" }],
    "react/destructuring-assignment": "off",
    "operator-linebreak": [2, "after"],
    "comma-dangle": [2, "never"],
    "no-param-reassign": [1],
    "no-underscore-dangle": "off",
    "no-console": [2, { "allow": ["warn", "error"] }],
  },
  "env": {
    "browser": true,
    "jest": true
  }
};
