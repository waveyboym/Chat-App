export default `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
            http-equiv="Content-Security-Policy"
            content="script-src https://apis.google.com/
                'self' 'unsafe-inline'"
        />
        <meta
            http-equiv="Content-Security-Policy"
            content="script-src http://developers.google.com/
                'self' 'unsafe-inline'"
        />
        <title>Fiddle Chat App</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;600&display=swap');
            body{
                margin: 0;
                font-family: 'Baloo Bhai 2', cursive;
            }

            .callback-template-screen{
                width: 100vw;
                height: 100vh;
                overflow: hidden;
                background: linear-gradient(252.46deg, #001D36 0%, #3F1A61 52.08%, #8A7A94 100%);
                background-blend-mode: hard-light;
            }

            .callback-template-content-page{
                width: 100vw;
                height: 100vh;
                background: rgba(37, 37, 37, 0.05);
                backdrop-filter: blur(35px);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            
            .splashscreen-content-page h1{
                color: #E6E6E6;
                font-size: 30px;
                margin-bottom: 20px;
            }

            .splashscreen-content-page h2{
                color: #E6E6E6;
                font-size: 18px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="callback-template-screen">
            <div class="callback-template-content-page">
                <h1>Fiddle Chat App</h1>
                <h2>You can now return back to the app and close this browser tab</h2>
            </div>
        </div>
    </body>
</html>
`