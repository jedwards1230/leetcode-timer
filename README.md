# LeetCode Timer

A Firefox extension that automatically starts to time your leetcode problems. It will also automatically stop the timer when you finish a problem, and compare your current time against your average.

![Screenshot](screenshot.png)

## Flow

- Timer begins automatically when you load a problem page
- Timer stops automatically upon new successful submission
- Timer continues on bad submission

## Build

Compile into zip and load to browser

``` 
npm run build-release
web-ext build
```
