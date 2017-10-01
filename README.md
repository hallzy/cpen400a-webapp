# CPEN 400A Web App Project

This is our repo for our term long web app project.

## Git Hooks

### Pre-Commit Hooks

Create a new file in `.git/hooks/` called `pre-commit`

#### Windows

Use this for the file contents (Make sure that the first line of the script is a
real file and location on your computer):

```bash
#!C:/Program\ Files/Git/usr/bin/sh.exe

# If there are whitespace errors, print the offending file names and fail.
git config core.whitespace "blank-at-eol,space-before-tab,tab-in-indent,blank-at-eof"
exec git diff-index --check --cached HEAD --
```

#### Linux

Use this for the file contents:

```bash
#!/bin/sh

# If there are whitespace errors, print the offending file names and fail.
git config core.whitespace "blank-at-eol,space-before-tab,tab-in-indent,blank-at-eof"
exec git diff-index --check --cached HEAD --
```
