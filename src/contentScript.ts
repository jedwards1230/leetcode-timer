import { parseTitle } from "./utils";
import Timer from "./timer";

//browser.storage.sync.clear();

let avgTime = 0;
let difficulty = '';
const problemTimer = new Timer();

const pageTitle: string = parseTitle(location.href)
const submissions: Problem = {
    title: pageTitle,
    times: []
}

// save submission time to sync storage
const saveSubmission = () => {
    submissions.times.push({
        timestamp: Date.now(),
        time_elapsed: problemTimer.currentTime
    })
    avgTime = submissions.times.reduce((acc, curr) => acc + curr.time_elapsed, 0) / submissions.times.length;

    const saveSubmission: SaveSubmission = {}
    saveSubmission[pageTitle] = JSON.stringify(submissions);
    browser.storage.sync.set(saveSubmission);
}

// check if latest submission is a pass or fail
const checkLatestSubmission = () => {
    // add observer to submissions component
    // run this function when the observer detects an update
    const mutationObserver = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            const mutation = mutations[i]!;
            const row = mutation.addedNodes[0] as HTMLElement;
            // keep checking until a table row is found
            if (row.nodeName === 'TR') {
                // this class is used for successful submissions
                const success = row.getElementsByClassName('ac__35gz');
                if (success.length > 0) {
                    console.log('success');
                    saveSubmission();
                } else {
                    console.log('fail');
                }
                problemTimer.pause();
                mutationObserver.disconnect();
            }
        }
    })
    // parent component where the submission table is located
    const parent = document.getElementsByClassName('submissions__1ROo')[0] as HTMLElement;
    mutationObserver.observe(parent, { childList: true, subtree: true });
}

const getHistory = () => {
    // grab historic times for this problem
    browser.storage.sync.get(pageTitle).then((result) => {
        if (result[pageTitle]) {
            const problem = JSON.parse(result[pageTitle]);
            submissions.times = problem.times;
            avgTime = submissions.times.reduce((acc, curr) => acc + curr.time_elapsed, 0) / submissions.times.length;
        }
    }).catch(e => console.log(e));
}

const getDifficulty = () => {
    const easy = parent.getElementsByClassName('css-14oi08n')[0] as HTMLElement;
    if (easy) {
        difficulty = 'easy';
        return
    }
    const medium = parent.getElementsByClassName('css-dcmtd5')[0] as HTMLElement;
    if (medium) {
        difficulty = 'medium';
        return
    }
    const hard = parent.getElementsByClassName('css-t42afm')[0] as HTMLElement;
    if (hard) {
        difficulty = 'hard';
        return
    }
}

const listenForSubmission = () => {
    // search for submit button
    const submitButton = parent.getElementsByClassName('submit__2ISl')[0] as HTMLElement;
    if (submitButton) {
        // assign listener to check submissions
        submitButton.addEventListener('click', () => checkLatestSubmission());
    }
}

const checkPageLoaded = (): boolean => {
    const el = parent.getElementsByClassName('submit__2ISl')[0] as HTMLElement
    return el ? true : false;
}

// event listener for page
browser.runtime.onMessage.addListener((request: Message, _sender, _sendResponse) => {
    if (request.cmd === 'get_time') {
        const response: Message = {
            state: problemTimer.paused ? 'paused' : 'running',
            cmd: 'time_elapsed',
            currentTime: problemTimer.currentTime,
            avgTime: avgTime,
            difficulty: difficulty
        }
        return Promise.resolve(response)
    } else if (request.cmd === 'pause') {
        problemTimer.pause();
        problemTimer.currentTime = request.currentTime!;
    } else if (request.cmd === 'resume') {
        problemTimer.currentTime = request.currentTime!;
        problemTimer.start();
    }
    return
});

getHistory();
problemTimer.start();

// observe until react app loads test environment
const parent = document.getElementById('app') as HTMLElement;
if (checkPageLoaded()) {
    listenForSubmission();
    getDifficulty();
} else {
    const mutationObserver = new MutationObserver(() => {
        if (checkPageLoaded()) {
            listenForSubmission();
            getDifficulty();
            mutationObserver.disconnect();
        }
    });
    mutationObserver.observe(parent, { childList: true, subtree: true });
}
