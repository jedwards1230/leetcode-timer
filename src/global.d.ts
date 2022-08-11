type TimerCommand = {
    cmd: string
    state?: string
    currentTime?: number
    avgTime?: number
}

type Problem = {
    title: string
    times: Entry[]
}

type Entry = {
    timestamp: number
    time_elapsed: number
}

type SaveSubmission = {
    [key: string]: string
}