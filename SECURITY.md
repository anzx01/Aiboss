# Security Policy

## Supported Versions

This project is in MVP development. Security fixes are applied to the `main`
branch.

## Reporting a Vulnerability

Please do not open a public issue for secrets, authentication problems, or data
exposure reports.

Report privately by contacting the repository owner through GitHub, or by
opening a draft security advisory if you have repository access. Include:

- A concise description of the issue
- Steps to reproduce
- Affected files, endpoints, or configuration
- Any relevant logs with secrets redacted

## Secret Handling

- Never commit `.env`, `.env.local`, database URLs, API keys, or private keys.
- Use `.env.example` files for placeholders only.
- If a secret is committed or pushed, revoke or rotate it immediately before
  cleaning Git history.
- Enable GitHub secret scanning and push protection before making the repository
  public.

## Data Handling Notes

The app may store task inputs, AI outputs, and a hash derived from request
metadata for session continuity. Avoid submitting sensitive personal data,
credentials, regulated data, or trade secrets unless you have reviewed the
deployment's privacy policy and LLM provider terms.
