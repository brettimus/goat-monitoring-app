# :goat: load monitoring :goat:
A simple javascript-all-the-way-down application for reporting and visualizing system load data in realtime.

> If you aren't familiar with the tools used herein, feel free to peruse the loose assembly of reading & viewing materials at the bottom of the readme.

## What's with the :goat:?
You might be wondering to yourself:
> :goat: ?

Well, **this is a load monitoring application**, okay? 

**It has nothing to do with goats** whatsoever. Don't be a silly-goat. Stop asking about the goats.
> :goat: .

## Quick Start
Big assumption here: **You should build and run this app on a unixy system**. 

> _Since load average is a unixy concept, that seems reasonable, right?_
> 
> **Correct!** :confetti_ball:

### 0. Hey! You need `node`, `npm`, and `make`

(Optionally, you may want to grab yourself a :goat:, but like I said, that's not what this application is about. Okay?)

### 1. Install the `backend` dependencies
From the project root, run: 
```bash
cd backend && npm i
```

### 2. Install the `frontend` dependencies
From the project root, run:
```bash
cd frontend && npm i
``` 

### 3. Test the `frontend` alert logic
From the project root, run:
```bash
cd frontend && npm test
```
If all the tests pass, you should see a colorful and friendly message in the console. With that, you're good to goat! :goat:

### 4. Build the `frontend`
_**Patience!** this might take a few seconds._

From the project root, run:
```bash
cd frontend && make
```

### 5. Run the app
From the project root, run:
```bash
node .
```

### 6. Eat Pizza
You deserve it. :pizza:

## How It Works
### A Quick Exposition
The `index.js` file in the project root connects the `frontend` and the `backend`. It does this by giving the backend server the following information:

- `pathToIndex`: Where the root html document is located
- `pathToAssets`: Where the assets for the frontend application are located

Our backend happens to serve the `index.html` file in the project root. This file expects that it can grab a `tada.js` file (served from the folder `frontend/dist`, our static asset directory). `tada.js` should in turn load the `frontend` build that consumes our `backend`.

The server uses node's `os` module in conjunction with `socket.io` to broadcast system load data to interested parties over websockets via `"loadavg update"` events. 

Speaking of those interested parties, how about that `frontend`, eh? 

The frontend is a standard React + Redux app built with webpack. The action that you'll probably want to check out is named `"ADD_LOAD_DATUM"`.  I used the `c3` charting library to create the visualization.

> *Psssst there's a secret little easter-egg action that has nothing to do with goats, but don't tell anyone shhhhh* :speak_no_evil: :goat:.

The production build listens for `"loadavg update"` events over websockets. When new data are received, an `"ADD_LOAD_DATUM"` action is dispatched with the new loadavg data. This re-renders the interface with our new data and any new alerts (if we crossed the stated `loadavg` threshold.)

The alert logic is handled inside `frontend/src/js/reducers/app-actions-alerts.js`.

### backend

- Is a thin `node/express` server 
- Takes a configuration object with
    + the path to the root html document
    + the path to the static assets folder
- Makes use of `os` and `socket.io` to broadcast system load information over websockets
- Prints a cute and colorful `"server listening"` message

#### The websocket api
The `"loadavg update"` event emits some data over websockets. That data looks like this:
```javascript
const loadavgUpdateData = {
    loadavg1, // One minute load average
    loadavg5, // Five minute load average
    loadavg15, // Fifteen minute load average
    timestamp, // Timestamp (ms since Jan. 1, 1970 +0000 UTC)
};
```

### frontend

- A standard `React` and `Redux` application built with `webpack`
- Uses the `expect` library for testing, as well as some daunting mocks
- In production, listens for `"loadavg update"` events over websockets
- In development, mocks a websocket connection and uses `webpack-dev-server` with hot reloading

#### Application state
The entire state of the application is held inside the Redux store. The state object includes the following fields:

```javascript
const state = {
  alerts,             // Array of `alert` objects
  maxAlertHistory,    // The maximum number of alerts to remember
  chartDataBuffer,    // A buffer of data we have received but not graphed yet
  chartUpdateInterval, // How long we should wait before adding data to chart
  latestDatumTimestamp, // Cached timestamp of the latest loadDatum we've seen
  latestChartTimestamp, // The time at which we last 
  loadData,           // Array of `loadDatum` objects
  loadAlertThreshold, // The minimum avg number that does not trigger an alert
  loadInterval,       // Interval between `loadData` objects (ms) - weakpoint of app
  loadSpan,           // Amt of time over which to viz loadDatum objects (ms)
  themeName,          // It's a surprise!
};
```

A `loadDatum` object has the following form:
```javascript
const loadDatum = {
  loadavg,   // Exactly what you thing it is
  timestamp, // The timestamp (provided by the server) of loadavg observation
};
```

An `alert` object has the following form:
```javascript
const alert = {
    type,                // Either "warning" or "success"
    message,     
    loadAlertThreshold, // Boundary that we crossed to trigger the alert
    twoMinuteAvg,       // Two-minute loadavg that triggered the alert
    timestamp,          // Time at which alert was triggered
};
```

#### Developing
The frontend also **makes use of feature flags** to help mock out the backend in development. (The production build removes these chunks of code for us.)

Thus, we can develop the frontend separately from the backend. (_I investigated a few different approaches here, and using feature flags seemed to be the simplest for the scope of this project.__) Furthermore, we can take advantage of :fire: hot module replacement while we work on the interface. (Thanks be to `webpack-dev-server`.) 

To check out the :fire: hot reloading, run the following from the project root:

```bash
cd frontend && npm i && npm start
```

#### Misc
The frontend build uses Babel's Stage2 preset, which gives us some of javascript's awesome forthcoming syntactic features. (:heart: object splats `...`.)

## Perceived Gotcha
**Calculating a two-minute loadavg.** 

Seeing as I keep one-minute loadavg measurements in one-second intervals, I calculated the two-minute loadavg by adding a one-minute loadavg measurement to another taken 60 seconds prior and then dividing by two. Mathematically, this made the most sense to me. I have no idea how it pans out in practice. (We can go over the assumptions at play here in person if you want.) 

## Critique
The current version of the application could benefit from one or more of these features.

### Jank
The visualization is janky, but there are probably some other reasons for jank too. Want to profile the app with me???? It'd be fun! Let's do it!! :bar_chart:

### Serverside Caching
The server could (should) cache its most recent data so that the client would not have to wait around before seeing a nontrivial amount of data.

### End-User Friendliness
It wasn't exactly clear _who_ the end-user was for this application. With more clarity on our audience, we might consider providing more context to the data that we present.

#### Flexible Settings
The user should be able to adjust certain parts of the app to their liking. E.g., 
- ~the alert threshold~ :tada:
- the maximum number alerts to display
- ~the timespan between data samples~ (sort of :tada: ?)
- the total window of time in the visualization

The app could provide sensible defaults and a simple way to toy with those defaults.

#### Contextual loadavg measurements
E.g., it's important to know how many cores the machine has alongside its loadavg.

#### Actionable Alert Messages
Alerts should be actionable. A better version of this application would suggest courses of action in the face of high load. E.g., we could report on what process(es) were eating up system resources.

### General frontend optimizations
There are several inefficiencies in the Redux code. At the current scale of the app, these inefficiencies are _probably_ just noise. However, if more charts and data got added, the frontend code would beg a good performance tune-up

### Error handling + Pernicious Assumptions
Error handling. Let's do it. E.g., what happens if the websocket connection goes kaput? What happens if... other stuff. You get the point.

Also, I am certain that sneaky depedencies abound. Ya know, little areas where code assumes that data are structured a certain way, etc. Can you find them?! I am tired.


## Reading Materials
Alright. I realize that I may have used a lot of tools with which you might not be familiar. 

Personally, I would be :rage: if I had to review this code, and I hadn't ever toyed with React, Redux, webpack, etc. 

In that instance, the best I can do is give you some light reading. This might not help mitigate the :rage:, but I really, really, really have come to love these tools. (I also felt like they fit this project particularly well.) After some fiddling, I think you might love these tools as well.

- [Getting started with React](https://facebook.github.io/react/docs/getting-started.html)
- [A Cartoon introduction to Redux](https://code-cartoons.com/a-cartoon-intro-to-redux-3afb775501a6#.j21u1hhw7)
- [Pete Hunt's webpack howto](https://github.com/petehunt/webpack-howto) (_wayyy better intro than the webpack docs_)
- [Dan Abramov's Redux video tutorial](https://egghead.io/lessons/javascript-redux-the-single-immutable-state-tree)

## The Original Prompt
For reference.
### Load monitoring web application
Create a simple web application that monitors load average on your machine:

- Collect the machine load (using “uptime” for example)
- Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
- Make sure a user can keep the web page open and monitor the load on their machine.
- Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High load generated an alert - load = {value}, triggered at {time}”
- Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered. 
- Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
- Write a test for the alerting logic
- Explain how you’d improve on this application design