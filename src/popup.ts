let elapsedTime = 0;
let startTime = 0;
let timerId: NodeJS.Timer;
let paused = false;

// given a number of seconds, return a string of the form "HH:MM:SS"
const formatTime = (time: number) => {
    time = Math.floor(time / 1000);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Adjust pause button in popup window
const setPauseButton = () => {
    if (paused) {
        document.getElementById('pause')!.innerText = 'Resume';
        document.getElementById('pause')!.onclick = startTimer;
        paused = false;
    } else {
        document.getElementById('pause')!.innerText = 'Pause';
        document.getElementById('pause')!.onclick = pause;
        paused = true;
    }
}

// clear the timer
// todo: record all pauses and timed intervals to calculate total time
const pause = () => {
    setPauseButton();
    clearInterval(timerId);
}

// start timer loop
const startTimer = () => {
    setPauseButton();
    timerId = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        document.getElementById('timerNow')!.innerText = formatTime(elapsedTime);
    }, 1000);
}

const logError = (error: Error) => {
    console.error(error);
}

// request the start time from the content script
const getTime = (tab: browser.tabs.Tab) => {
    const message: TimerCommand = {
        from: 'popup',
        cmd: 'get_time'
    }
    
    browser.tabs.sendMessage(tab.id!, message).then((response: TimerCommand) => {
        // assign start time to popup window
        if (response.cmd === 'time_elapsed') {
            startTime = response.startTime!;
            elapsedTime = Date.now() - startTime;
            document.getElementById('timerNow')!.innerText = formatTime(elapsedTime);
        }
    }).catch(logError).finally(startTimer);
}

const getTitle = (url: string) => {
    const regex = /problems\/([^\/]+)\/*/;
    const match = url.match(regex);
    if (match) {
        // clean up the title
        let problemTitle = match[1] as string;
        // remove dashes
        problemTitle = problemTitle.replace(/-/g, ' ');
        // capitalize first letters
        problemTitle = problemTitle.split(' ').map(word => word[0]!.toUpperCase() + word.slice(1)).join(' ');
        // render
        document.getElementById('problemTitle')!.innerText = problemTitle;
    }
}

// communicate with content script
// this stores the start time so it can persist when page action window is closed
const tabQuery = browser.tabs.query({ active: true, currentWindow: true });
tabQuery.then((tabs) => {
    const tab = tabs[0]!;
    getTime(tab);
    getTitle(tab.url!);
});
