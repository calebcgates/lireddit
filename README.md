Tutorial:
https://www.youtube.com/watch?v=I6ypD7qv3Z8

Extensions for VS Code that they use (I'll be using webstorm, probably similar extensions)

Webstorm -> Preferences -> Plugins -> Browse Repositories (also Intelij Plugins was used for vim)

- Bracket Pair Colorizer 2   ----> 10080 rainbow brackets (webstorm)
- Docker ----> Already installed...
- Graphql for VSCode ----> JS Graphql (webstorm)
- DONE: Prettier ----> Could not find  -- Auto formats file when you save it (THis is probably really helpful with quality readable code)
  - https://prettier.io/docs/en/webstorm.html
  - https://plugins.jetbrains.com/plugin/10456-prettier
  - https://plugins.jetbrains.com/plugin/10456-prettier/versions
  - Download zip file
  - added to WebstormProjects/WebstormPlugins
  - Webstorm -> Preferences -> Plugins -> Install From Disk
  - Not working
  - Think I need to update webstorm - going to wait until later
  - Webstorm -> Preferences -> Apperance & Behavior -> System Settings -> Updates
  - Download and install newest version
  - Then Try Again 
  - I closed webstorm, double clicked install, dragged to applications on mac, clicked replace old version, and voila all set.  Now all the tutorials
  make sense because the layout of new webstorm has changed since 2017! how does it not auto update when "check for new versions" is on?
- Vim ----> IdeaVim
Restart webstorm to initiate these changes

Start Project:
- npm init -y
- nvm install v14.5.0
- go into prefferences and select this under languages npm node
- Also run in the command line *** nvm use 14.5.0
- npm -v is 6.14.5

Step 1: set up typscrpt and get them to work together
- will sometimes use yarn instead of npm on yarn version 1.22.4
- yarn add -D @types/node typescript
    - Types for node just gives access to type information for built in node functions
- yarn add -D ts-node
- npx tsconfig.json

- tsc -w  (run typescritp with the watch command)
    - this watches for changes and compiles project quickly into pure javascript in a new folder called dist.  
    - so start command "node dist/index.js" will run compiled file

- *** nvm use 14.5.0
- yarn add -D nodemon 
    - watches for changes automatically
    
*** You need nvm watch running in one terminal and npm dev running in another terminal

Setup 2: setup mikroORM
- yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg
- (postgres needs to be installed and running on computer)
- createdb lireddit

- for some reason could not find "CORE" so had to download using: npm install @mikro-orm/core

*** Ctrl + Space shows all auto complete options

part 3: mikroorm entity examples
http://mikro-orm.io/docs/defining-entities/

*** createuser postgres
- perfect needed this ^^


## Run Migrations
npx mikro-orm migration:create
