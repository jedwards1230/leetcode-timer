type Message = {
    cmd: string
    state?: string
    currentTime?: number
    avgTime?: number
    difficulty?: string
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