# Gumawa ng sarili mong GitHub repository

The deliverable is a local source repository; no remote repository is created automatically. You choose the GitHub owner, visibility, and name. Recommended repository name: `Copy7-Editor`.

1. Sign in to GitHub and create a new empty repository. Choose Private if you want the source private. Do not initialize a second README/license if you will push this existing source tree.
2. Extract/open the source folder locally. The ZIP excludes `.git` internals; initialize Git if needed:

```powershell
git init
git branch -M main
```

3. Before staging, inspect what Git sees:

```powershell
git status --short --ignored
```

`.env`, `inbox`, `outbox`, `my-sounds`, `kit`, `.venv`, and personal style/rules should be ignored except empty `.gitkeep` placeholders. Keep private files within those ignored locations. Do not stage an engine backup directory or private brief saved elsewhere.

4. Stage source and docs, then inspect staged filenames:

```powershell
git add .
git diff --cached --name-only
```

If private files appear, unstage them and fix ignore rules before continuing. Keep LICENSE and NOTICE.md. Commit when the staged content is correct:

```powershell
git commit -m "Create Taglish video editing workspace"
```

Git may ask you to configure your own author name/email if not yet configured. Use your actual preferred Git identity.

5. Set the remote using the actual URL from the GitHub repository you created. Replace `YOUR-USERNAME` below before running:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/Copy7-Editor.git
git push -u origin main
```

If `origin` already exists, inspect `git remote -v` and confirm the destination before changing it. Authenticate through GitHub's supported credential flow; never put a password/token into a prompt or remote URL.

6. Open the repository page and check the README, docs, skill adapters, and code are present. Private footage and exports should not be there. GitHub contains the source workflow; normal git push will not back up ignored personal video projects.

## Update an existing GitHub repository

Copy the contents of the extracted `Copy7-Editor/` folder into the intended project folder in your existing local clone. Preserve `.agents`, `.claude`, `.env.example`, and `.gitignore`. Do not replace your actual `.env` or private media/preferences with sample data.

If older project-named skill folders remain in `.agents/skills` or `.claude/skills`, move those obsolete skill folders outside the workspace after confirming the new `copy7-editor` skill exists. Start a fresh agent session so it reads the new name.

Check the changes using `git status` and `git diff`, stage only the intended source/docs, commit, and push to the existing remote. If you also want a different GitHub repository name, rename it in the repository Settings and update your clone's remote URL to the actual new URL. This package does not perform that remote rename or push.
