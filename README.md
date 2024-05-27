# qin add

Duplicate this project at 5-27-2024


# DE-web-03

use node v16.20.0
// package-lock.json is important, not to delete
npm install --legacy-peer-deps
npm run start
npm run build

## Fonnt End

Use the startup code.

npm init

lsof -i tcp:3000

netstat -ltnp

lsof -i tcp:5000

https://deepeqm.com/
https://onphysics.com/

## copy the repository from akimoto
To check in the cloned project into a new repository on GitHub, follow these steps:

Create a new repository on GitHub. Do not initialize it with a README, .gitignore, or License. This creates an empty repository.

Open your terminal and navigate to the cloned project's directory.

Remove the existing git history by running the following command:
rm -rf .git

Initialize a new git repository in the project directory:
git init

Add all the files in the directory to the new repository:
git add .

Commit the files:
git commit -m "Initial commit"c

Link the local repository to the new GitHub repository. Replace your-username and your-repository with your GitHub username and the name of your new repository:
git remote add origin https://github.com/your-username/your-repository.git

Push the files to the new GitHub repository:
git push -u origin master

Now, your cloned project is checked into a new repository on GitHub.