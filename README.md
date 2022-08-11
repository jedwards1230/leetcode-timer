# LeetCode Timer

A small web extension that automatically starts to time your leetcode problems. It will also automatically stop the timer when you finish a problem, and compare your current time against your average.

![Screenshot](screenshot.png)

## Flow

- Timer begins automatically when you load a problem page
- Timer stops automatically upon new successful submission
- Timer continues on bad submission

## Build

Run webpack

``` 
npm run build
npm run build-release # this is for minified code
```

Compress

```
web-ext build
```

Load zip file as browser addon
