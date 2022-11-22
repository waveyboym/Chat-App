// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// When document has loaded, initialise

const ipcrendererobj = window.electron.ipcRenderer;

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    if(document.getElementById('minimize') !== null){
        document.getElementById('minimize').addEventListener("click", () => {
            ipcrendererobj.sendMessage("minimize-window");
        });
    }

    if(document.getElementById('maximize') !== null){
        document.getElementById('maximize').addEventListener("click", () => {
            toggleMaxRestoreButtons();
            ipcrendererobj.sendMessage("toggle-maximize-window");
        });
    }

    if(document.getElementById('restore') !== null){
        document.getElementById('restore').addEventListener("click", () => {
            toggleMaxRestoreButtons();
            ipcrendererobj.sendMessage("toggle-maximize-window");
        });
    }
    
    if(document.getElementById('close') !== null){
        document.getElementById('close').addEventListener("click", () => {
            ipcrendererobj.sendMessage("close-window");
        });
    }
}

async function toggleMaxRestoreButtons() {
    let res = await ipcrendererobj.ask("iswinMaximized");
    if (res) {
        document.getElementById('maximize').style.visibility = "visible";
        document.getElementById('restore').style.visibility = "hidden";
    } else {
        document.getElementById('restore').style.visibility = "visible";
        document.getElementById('maximize').style.visibility = "hidden";
    }
}