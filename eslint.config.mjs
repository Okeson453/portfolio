import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    // ✅ WCAG 2.2 Accessibility Compliance — Prevents a11y regressions
    ...compat.extends("plugin:jsx-a11y/recommended"),
    {
        rules: {
            // Critical accessibility rules — fail build if violated
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/interactive-supports-focus": "error",
            "jsx-a11y/label-has-associated-control": "error",
            "jsx-a11y/no-noninteractive-element-interactions": "error",
            "jsx-a11y/no-static-element-interactions": "warn",
            "jsx-a11y/aria-role": "error",
            "jsx-a11y/aria-props": "error",
            "jsx-a11y/aria-unsupported-elements": "error",
            "jsx-a11y/role-has-required-aria-props": "error",
        }
    }
];

export default eslintConfig;
