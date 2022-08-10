import { getTitle } from "./utils";

let startTime = Date.now();

const pageTitle: string = getTitle(location.href)

// save submission time to sync storage
const saveSubmission = (time: Date) => {
    const submission: any = {};
    submission[pageTitle] = time.toLocaleString()
    browser.storage.sync.set(submission);
    const test = browser.storage.sync.get(pageTitle);
    test.then((res) => {
        console.log('stored:', res);
    }).catch((err) => {
        console.log(err);
    })
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
                    const timeCol = row.querySelector('.time-column__1guG') as HTMLElement;
                    const timeSubmitted = new Date(timeCol.innerText);
                    saveSubmission(timeSubmitted);
                } else {
                    console.log('fail');
                }
                mutationObserver.disconnect();
            }
        }
    })
    // parent component where the submission table is located
    const parent = document.getElementsByClassName('submissions__1ROo')[0] as HTMLElement;
    mutationObserver.observe(parent, { childList: true, subtree: true });
}

browser.runtime.onMessage.addListener((request: TimerCommand, _sender, _sendResponse) => {
    if (request.cmd === 'get_time') {
        const response: TimerCommand = {
            from: 'contentScript',
            cmd: 'time_elapsed',
            startTime: startTime
        }
        return Promise.resolve(response)
    }
    return
});


// observe until react app loads test environment
const mutationObserver = new MutationObserver(() => {
    // search for submit button
    const submitButton = document.getElementsByClassName('submit__2ISl')[0] as HTMLElement;
    if (submitButton) {
        // assign listener to check submissions
        submitButton.addEventListener('click', () => checkLatestSubmission());
        mutationObserver.disconnect();
    }
})
const parent = document.getElementById('app') as HTMLElement;
mutationObserver.observe(parent, { childList: true, subtree: true });
