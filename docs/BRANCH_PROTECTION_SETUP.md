# Branch Protection Setup

This document provides instructions for setting up branch protection rules on GitHub to ensure code quality and safety.

## Manual Configuration Required

The following settings must be applied manually in the GitHub repository settings (they cannot be automated).

### Go to GitHub Repository Settings

1. Navigate to: https://github.com/Okeson453/portfolio/settings/branches
2. Click **"Add rule"** to create a new branch protection rule

## Configure Rule for `main` Branch

### Rule Name
Enter: `main`

### Require a pull request before merging
- ✅ **Check this box**
- Set "Required number of approving reviews" to: `1`
- ✅ **Check: "Dismiss stale pull request approvals when new commits are pushed"**
- ✅ **Check: "Require review from Code Owners"**

### Require status checks to pass before merging
- ✅ **Check this box**
- ✅ **Check: "Require branches to be up to date before merging"**

**Select these required status checks** (must pass for all PRs):
- `quality` (from CI workflow)
- `test` (from CI workflow)
- `build` (from CI workflow)

### Require linear history
- ✅ **Check this box** (prevents merge commits)

### Restrictions
- ✅ **Check: "Do not allow bypassing the above settings"**

### Summary
When complete, your rule should have these settings enabled:
- ✅ Require pull request before merging (1 review)
- ✅ Require status checks (quality, test, build)
- ✅ Require branches up to date
- ✅ Require linear history
- ✅ Dismiss stale reviews
- ✅ Require CODE_OWNERS review
- ✅ No force pushes allowed

---

## Additional Repository Settings

Go to: https://github.com/Okeson453/portfolio/settings/general

### Pull Requests
Under "Pull Requests" section:

- ✅ **Allow squash merging** (set as default)
- ☐ **Uncheck: Allow merge commits**
- ☐ **Uncheck: Allow rebase merging**
- ✅ **Check: "Automatically delete head branches after merge"**

### Features
Under "Features" section:

- ✅ **Issues** (keep enabled)
- ✅ **Projects** (keep enabled)
- ☐ **Wiki** (disable — use `/docs` instead)
- ✅ **Discussions** (optional — keep or disable per preference)

---

## GitHub Actions Secrets (if using CI/CD with external services)

Go to: https://github.com/Okeson453/portfolio/settings/secrets/actions

These are needed only if you integrate these services:

| Secret | Used By | Where to Get It |
|---|---|---|
| `LHCI_GITHUB_APP_TOKEN` | Lighthouse CI | https://github.com/apps/lighthouse-ci |
| `VERCEL_TOKEN` | Vercel Deployment | https://vercel.com/account/tokens |
| `SENTRY_AUTH_TOKEN` | Sentry Integration | https://sentry.io → User Settings → Auth Tokens |

---

## Verification

After completing the above, verify your configuration:

1. Create a test branch: `git checkout -b test-branch`
2. Make a commit: `echo "test" > test.txt && git add . && git commit -m "test"`
3. Push: `git push origin test-branch`
4. Create a pull request on GitHub
5. Verify that:
   - ✅ CI/CD workflows start automatically
   - ✅ Cannot merge until workflows pass
   - ✅ Cannot merge until 1 review is received
   - ✅ After merge, branch is automatically deleted

Once verified, delete the test branch and test PR.

---

## Disabling Bypass for Admins

Important: The setting **"Do not allow bypassing the above settings"** means **even repository admins cannot bypass these rules**. This is maximum security.

If you need to override accidentally:
1. Temporarily remove the branch protection rule
2. Merge your PR manually
3. Re-enable the rule

---

## Troubleshooting

### Error: "Cannot merge — CI checks failed"
- Go to Actions tab → View the failing workflow
- Fix the issue locally and push a new commit
- Checks will run automatically

### Error: "Cannot merge — need 1 approval"
- Ask a collaborator to review the PR
- Or temporarily reduce the "required approvals" to 0 (not recommended for production)

### Status checks not showing up
- Ensure `.github/workflows/ci.yml` (or other workflow files) are committed and pushed
- GitHub Actions must be enabled: Settings → Actions → "Allow all actions and reusable workflows"
