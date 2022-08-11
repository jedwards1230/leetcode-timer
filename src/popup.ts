import Timer from "./timer";
import { parseTitle } from "./utils";

let timerId: NodeJS.Timer;
const problemTimer = new Timer();
let avgTime = 0;

// communicate with content script
// this stores the start time so it can persist when page action window is closed
const tabQuery = browser.tabs.query({ active: true, currentWindow: true });
tabQuery.then((tabs) => {
    const tab = tabs[0]!;
    getTime(tab);

    const pageTitle = parseTitle(tab.url!);
    // render
    document.getElementById('problemTitle')!.innerText = pageTitle;
    return tab
});

// send message to content script to pause timer
const pause = () => {
    const message: Message = {
        cmd: 'pause',
        currentTime: problemTimer.currentTime
    }

    problemTimer.pause();
    setPauseButton();
    clearInterval(timerId);

    tabQuery.then((tabs) => {
        const tab = tabs[0]!;
        browser.tabs.sendMessage(tab.id!, message);
    });
}

// send message to content script to resume the timer
const resume = () => {
    const message: Message = {
        cmd: 'resume',
        currentTime: problemTimer.currentTime
    }

    setPauseButton();
    problemTimer.paused = false;

    tabQuery.then((tabs) => {
        const tab = tabs[0]!;
        const resumeCmd = browser.tabs.sendMessage(tab.id!, message);
        resumeCmd.then(() => {
            getTime(tab);
        }).catch(logError);
    }).catch(logError);
}

// Adjust pause button in popup window
const setPauseButton = () => {
    if (problemTimer.paused) {
        document.getElementById('pause')!.innerText = 'Resume';
        document.getElementById('pause')!.onclick = resume;
    } else {
        document.getElementById('pause')!.innerText = 'Pause';
        document.getElementById('pause')!.onclick = pause;
    }
}

// start timer loop
const startTimer = () => {
    if (problemTimer.paused) return
    const timerEl = document.getElementById('timerNow')!;
    problemTimer.start();
    timerId = setInterval(() => {
        Timer.printTime(problemTimer.currentTime, timerEl);
    }, 1000);
}

const logError = (error: Error) => {
    console.error(error);
}

// request the start time from the content script
const getTime = (tab: browser.tabs.Tab) => {
    const message: Message = {
        cmd: 'get_time'
    }

    browser.tabs.sendMessage(tab.id!, message).then((response: Message) => {
        // assign start time to popup window
        if (response.cmd === 'time_elapsed') {
            // grab necessary elements
            const timerEl = document.getElementById('timerNow')!;
            const avgTimerEl = document.getElementById('timerAvg')!;
            const title = document.getElementById('problemTitle')!;

            // update
            problemTimer.paused = (response.state === 'paused');
            problemTimer.currentTime = response.currentTime!;
            avgTime = response.avgTime!;
            title.classList.add(response.difficulty!);

            // render times
            if (avgTime > 0) Timer.printTime(avgTime, avgTimerEl);
            Timer.printTime(problemTimer.currentTime, timerEl);
            setPauseButton();
        }
    }).catch(logError).finally(startTimer);
}