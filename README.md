# Chat-App
A real time chat application done with tauri and react with a firebase backend

# Note
This branch is done with tauri. The old version which is done with electron is accessible here: https://github.com/waveyboym/Chat-App/tree/read-only-old-version.
The old version will no longer receive updates and/or fixes. I'm just putting it up in case anyone might want to have access to it.

# Presentation
![private messaging](img/privchat.png "private messaging")
\
\
\
\
![room messaging"](img/roomchat.png "room messaging")

# Technologies & Tools used and npm packages
1. Tauri: https://tauri.app/
2. Figma(for designing the UI): https://github.com/figma
3. SCSS: https://github.com/sass/sass
4. Framer Motion(Animations and transitions): https://github.com/framer/motion
5. Material UI: https://github.com/mui/material-ui
6. Emoji-Mart: https://github.com/missive/emoji-mart
7. Firebase: https://github.com/firebase/
8. React-colorful: https://github.com/omgovich/react-colorful
9. React-loader-spinner: https://github.com/mhnpd/react-loader-spinner
11. Use-local-storage: https://github.com/nas5w/use-local-storage
12. Icon pack(Basil Icons): https://www.figma.com/community/file/931906394678748246

# I am a user/tester
Executable for windows is available <a href="https://github.com/waveyboym/Chat-App/releases/tag/v0.0.2-alpa">here</a> \
Executable for MacOS, and Linux will be coming soon...

# I am a developer
1. Setup Tauri on your desktop following the instructions here <a href="https://tauri.app/v1/guides/getting-started/prerequisites">set up tauri</a>
2. Once Tauri has been set up, download the source files from this repo and copy and pase everything contained in <a href="https://github.com/waveyboym/Chat-App/tree/main/Fiddle%20Chat%20App">Fiddle Chat App</a> into the root of your newly created project.
3. If you do not have node js installed on your computer, install it here <a href="https://nodejs.org/en/download/">nodejs</a>
4. Open a terminal where the folder that you just downloaded is located and run ```npm install```. This will install all the npm packages used by this projct for you.
5. Setting up firebase, since firebase has not been set up, you will not be able to get past the signup/login page once the app is launched. To set up firebase, follow the instructions below titled under "Setting up firebase".
6. Once that is completed, you can start a development server by running: ```npm run tauri dev```. Please note that by default, the appliction will launch in a frameless window. If you want to change that, follow the instructions for changing that under "Change App window from frameless to not frameless".

# Setting up firebase
1. To set up firebase, navigate to <a href="https://firebase.google.com/docs/web/setup?authuser=0#add-sdk-and-initialize">firebase setup</a> and follow the instructions.
2. Once you have created a new project, add your <a href="https://firebase.google.com/docs/web/learn-more?authuser=0#config-object">Firebase project configuration</a> into the file <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App%20src%20files(windows-os)/src/firebase.js">firebase.js</a> that came from this repository when you downloaded the source files.
3. Now add support for google, facebook, twitter, github and email and password authentication. According to firebase docs, the instructions for that are as follows:\
       **Enable Google as a sign-in method in the Firebase console:**\
       **In the Firebase console, open the Auth section.**\
       **On the Sign in method tab, enable the Google sign-in method and click Save**\
   The process for adding other sign-in methods is pretty much the same.
4. To set up a database, follow the instructions here: <a href="https://firebase.google.com/docs/database/web/start?hl=en&authuser=0#create_a_database">setting up a database</a>
5. create a collections in the database and name it "users" and add a document. It can be empty document; it is more so as a placeholder and you can delete it once your database has been populated with other users.
6. Create a storage for your database. This allows users to store their profile pictures. The instructions for that are here: <a href="https://firebase.google.com/docs/storage/web/start?hl=en&authuser=0">creating a storage</a>
7. You should now be done
8. The rules I used for this database:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.AccountActive == true
    }
  }
}
```
more information about rules in your database: https://firebase.google.com/docs/firestore/security/get-started

# Change App window from frameless to not frameless
1. Open <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/App.tsx">App.tsx</a> and comment out all the code that is not commented out and uncomment all the code that is commented out, so coment out everything from line 1 to line 119 and uncomment everything from line 123 up until lin 171.
2. Open <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/App.css">App.css</a> and at line 131, 140 and 158 where there is a comment saying /*change to 660px when using OS title bar, change to 700px when using custom*/, change the values to 660px, that is change ```min-height: 700px;``` to ```min-height: 660px;``` or example.
3. Open <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/styles/_constantMixins.scss">_constantMixins.scss</a> and at line 158 change \ ```$title-bar-height: 40px;//change to 0px when using OS title bar, change to 40px when using custom title bar``` \ to \ ```$title-bar-height: 0px;//change to 0px when using OS title bar, change to 40px when using custom title bar```
4. Open <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src-tauri/tauri.conf.json">tauri.conf.json</a> and replace everything in that file with the code found in <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src-tauri/tauriconfijson.txt">tauriconfijson.txt</a>, line 109 - line 204. It is titled under "TAURI CONFI FOR NON-FRAMELESS WINDOW"
5. You are done and may now launch the app with ```npm run tauri dev```

# Adding more colour themes
1. To add another colour theme, first go to <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/components/sub_components/Themes.tsx">Themes.tsx</a> and going to line 155 and copying aand pasting the code above it, i looks like this \ ```<div className="theme-selector">
            <motion.div 
              className={themeCol === "light-yellow-col" ? "colour-circle selected-colour-circle" : "colour-circle"}
              id="light-yellow-col" 
              whileHover={{scale: 1.03}} 
              whileTap={{scale: 0.97}} 
              onClick={() => changeThemeColours("light-yellow-col", "lyellow")}>
            </motion.div>
            <h3>Light yellow theme</h3>
          </div>```
2. Change the parametes to suite your needs fo the colour you want to create.
3. Go to <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/App.tsx">App.tsx</a> and at line 28 add the colour name of your colour, eg "lgreen" was chosen above, so lyellow would be added as another colourtheme to compare \ ```colourtheme === "light" || colourtheme === "lpink" || colourtheme === "lred" || colourtheme === "lgreen" || colourtheme === "lyellow"```
4. Do the same thing as above at line 33 in the same file
5. Go to <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/styles/Settings.scss">Settings.scss</a> and at line 448 add the class name of the theme-selector you created and it's corresponding colour, eg ```#light-yellow-col{background: #f8e962;}```
6. Go to <a href="https://github.com/waveyboym/Chat-App/blob/main/Fiddle%20Chat%20App/src/styles/_constantMixins.scss">_constantMixins.scss</a> and depending on whether or not the colour you created is a darker or lighter colour, copy all the code in root, that is line 1 to 14 or line 16 to 29 and paste it at line 131.
7. Name ```[data-theme='dgreen']``` with the name of your colour, eg ```[data-theme='lyellow']```. Make sure this matches otherwise the colours won't reflect when you change the theme.
8. Change the three variables, --root-dark-side-bar-col,
    --root-top-most-app-draggable-sec and 
    --root-lighter-side-bar-col by adjusting their colours in the section of code you just copied over to suit your needs.
9. You are done and may now launch the app with ```npm run tauri dev```

 # TODO
1. Improve load times between opening messages
2. Improve user interface for navigating between private messages and room messages(DONE)
3. Add support for presence detection(whether or not a user is online)
4. Add ability to view all friends in a separate component(DONE)
5. Add stories/most recent updates
6. Maybe add more themes(DONE)

# Images used in presentation
1. https://unsplash.com/photos/ruJm3dBXCqw
2. https://unsplash.com/photos/PGdW_bHDbpI
3. https://unsplash.com/photos/m_7p45JfXQo
4. https://unsplash.com/photos/nY14Fs8pxT8
