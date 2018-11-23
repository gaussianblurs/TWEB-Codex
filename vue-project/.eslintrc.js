module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/essential'
  ],
  rules: {
    "space-in-parens": [0, "always"],
    "template-curly-spacing": [2, "never"],
    "object-curly-spacing": [2, "always"],
    "object-curly-newline": "off",
    "no-use-before-define": [2, { "functions": false }],
    "semi": [2, "never"],
    "operator-linebreak": [2, "after"],
    "comma-dangle": ["error", "never"]
  },
  "env": {
    "browser": true,
  }
}
