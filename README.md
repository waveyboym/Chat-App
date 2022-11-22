# Chat-App
A real time chat application done with electron and react with a firebase bankend

# Presentation
![private messaging](img/privchat.png "private messaging")
\
\
\
\
![room messaging"](img/roomchat.png "room messaging")

# Technologies & Tools used and npm packages
1. Electron + React boilerplate: https://github.com/electron-react-boilerplate/electron-react-boilerplate
2. Figma(for designing the UI): https://github.com/figma
3. SCSS: https://github.com/sass/sass
4. Framer Motion(Animations and transitions): https://github.com/framer/motion
5. Material UI: https://github.com/mui/material-ui
6. Emoji-Mart: https://github.com/missive/emoji-mart
7. Firebase: https://github.com/firebase/
8. React-colorful: https://github.com/omgovich/react-colorful
9. React-loader-spinner: https://github.com/mhnpd/react-loader-spinner
10. React-time-ago: https://github.com/JoseRFelix/react-toggle-dark-mode
11. Use-local-storage: https://github.com/nas5w/use-local-storage

# I am a user/tester
Executable for MacOS, Linux and Windows will be coming soon

# I am a developer
1. Make a folder on your desktop named for example "ChatApp"
2. Visit https://github.com/electron-react-boilerplate/electron-react-boilerplate and follow readme instructions to download the boilerplate code\
                                        \
                                         OR\
                                         \
Clone Electron react boilerplate from github by running and naming your chat app project
```
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git <Chat App project name>
cd <Chat App project name>
npm install
``` 
3. Once that is done, delete all files in <Chat App project name>/src/renderer
4. clone the files in the folder labelled as "Source Files" from this repository into <Chat App project name>/src/renderer
5. In <Chat App project name>/src/main delete a file named "main.ts"
5. clone the file labelled as "main.ts" in the folder labelled "renderer" from this repository into <Chat App project name>/src/main
7. Open a terminal where your project is located <Chat App project name> and run this command:
```bash
npm start
```
8. To make changes, you can do so by going to <Chat App project name>/src/renderer and modifying any of the source files there and you will immediately see a refresh thanks to React's Fast Refresh
9. To make a production build for your operating system, run
```bash
npm run package
```

# Images used in presentation
1. https://unsplash.com/photos/ruJm3dBXCqw
2. https://unsplash.com/photos/PGdW_bHDbpI
3. https://unsplash.com/photos/m_7p45JfXQo
4. https://unsplash.com/photos/nY14Fs8pxT8

# TODO
1. Improve load times between opening messages
2. Improve user interface for navigating between private messages and room messages
3. Add support for presence detection(whether or not a user is online)
4. Add ability to view all friends in a separate component 
5. Add stories/most recent updates
6. Maybe add more themes
