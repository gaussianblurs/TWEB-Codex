module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "semi": ["error", "never"],
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "prefer-destructuring": ["error", {"object": true, "array": false}],
    "comma-dangle": ["error", "never"],
    "no-console": ["error", { allow: ["warn", "error"] }]
  }
}
