#!/bin/bash

# Check if a commit message is provided
if [ -z "$2" ]; then
  echo "Error: Commit message is required."
  echo "Usage: ./git_push.sh <add-option> \"Your commit message here\""
  echo "Example: ./git_push.sh . \"Initial commit\""
  exit 1
fi

# Capture add option (file name, path, or .)
ADD_OPTION=$1

# Capture commit message
COMMIT_MESSAGE=$2

# Stage specified changes
git add $ADD_OPTION

# Commit changes with the provided message
git commit -m "$COMMIT_MESSAGE"

# Push changes to the 'main' branch
git push -u origin main

# Success message
echo "Changes pushed to origin/main successfully."
