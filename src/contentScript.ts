let startTime = Date.now();

browser.runtime.onMessage.addListener((request: TimerCommand, _sender, _sendResponse) => {
    if (request.cmd === 'get_time') {
        return Promise.resolve({
            from: 'contentScript',
            cmd: 'time_elapsed',
            startTime: startTime
        })
    }
    return
});