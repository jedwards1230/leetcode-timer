// starts counting up from 0
// constructor can take custom start time to pick up from
// start and pause functions
class Timer {
    currentTime: number
    paused: boolean = false;
    id?: NodeJS.Timer

    constructor(startTime: number = 0) {
        this.currentTime = startTime;
    }

    start = () => {
        this.paused = false;
        this.id = setInterval(() => {
            this.currentTime += 1;
        }, 1000);
    }

    pause = () => {
        this.paused = true;
        clearInterval(this.id);
    }

    static printTime = (time: number, e: HTMLElement) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = time - hours * 3600 - minutes * 60;
        const timeStr = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        e.innerText = timeStr;
    }
}

export default Timer;