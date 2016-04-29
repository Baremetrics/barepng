# [Baremetrics](https://baremetrics.com/) BarePNG [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/baremetrics/barepng/tree/public)
_[Baremetrics](https://baremetrics.com) provides one-click subscription analytics & insights. **[Get started today!](https://baremetrics.com)**_

Built by [Tyler van der Hoeven](https://github.com/tyvdh)

---

BarePNG is a little app we built to turn our charts into slick PNGs for our [Slack Bot](https://slack.com/apps/A0PSKV32Q-baremetrics) and emails. Download, serve and enjoy or just use our little free standing **[demo](https://barepng.herokuapp.com)** to snag a few quick graph PNGs every now and again.

## How it works

The app itself is actually very simple. We have one page at `/chart` that hosts the svg, drawn from a small JavaScript file using the url queries.

With that page in place all we have to do is call the `/api` url with the appropriate queries and [PhantomJS](http://phantomjs.org/) will take care of the rest.

Just look! `https://barepng.herokuapp.com/api?start=14609556&data=[0,10,20,50,20]&symbol=^%25`
![BarePNG Image](https://barepng.herokuapp.com/api?start=14609556&data=[0,10,20,50,20]&symbol=^%25)

## Base keys
**`start`**
> 8 digit number to start the graph on, will be added unto just like data with the `step` value 

```js
// new Date().setHours(0,0,0,0) / 100000
start=14609556
```

**`step`**
> Number to add onto the iteration from the `start` value. Default is `864`, one day

```js
// day = 864
// week = 6048
// 30 day = 25920
step=864
```

**`data`**
> `Array` of values starting with an initial value and proceeding with additional values which will be added on to the previous summarized value (i.e `data=100,50,-10` // 100, 150, 140)

```js
data=[4500,20,35,5,-20,15,-5,20,15,-5,10,-15,5]
```

**`w`**
> Number width of the generated graph and image. Default is `800`

```js
w=800
```

**`h`**
> Number height of the generated graph and image. Default is `400`

```js
h=400
```

**`style`**
> Select the graph style. Default is.. well.. default

```js
// default, email
style=email
```

## Default keys
**`symbol`**
> `String`. Symbol and placement for the x axis labels. Pretend the `^` is your number, cause that's where it will show up. Default is `''`

```js
symbol=^% // 45%
symbol=$^ // $1,000
```

## Email keys
**`goal`**
> Array for creating a goal line for your email graph by sending the start date, start value, end date and end value. 
>  
> **note this is a little different then the data key as all four values are their actual final values and not values which will be added onto inside a loop*

```js
goal=[14609556,4500,14619924,4600]
```

## Example URLs
> Base "Slack" graph

```
?start=14609556&data=[4500,20,35,5,-20,15,-5,20,15,-5,10,-15,5]&symbol=$^
```

> Base "Email" w/goal

```
?style=email&start=14609556&data=[4500,20,35,5,-20,15,-5,20,15,-5,10,-15,5]&w=600&h=250&goal=[14609556,4500,14619924,4600]
```

> Nice large % based graph with 7 day (week) steps

```
?start=14609556&step=6048&data=[0,100]&w=1200&h=600&symbol=^%
```

---

It's worth noting that once you're hosting the app yourself there's no reason for you to not completely change it. Try adding your own keys and CSS for the stuff that shows up at `/chart`. It's your app so make it yours! It's easy!

## Developing

1. clone this repo or your own fork
2. Install meteor if you haven't already [https://www.meteor.com/install](https://www.meteor.com/install)
3. cd into this directory and run `meteor`. Your app will be up and running locally

## Deploying to Heroku yourself for hacking

Replace `<app-name>` with the name of your app

1. Fork this repo
2. Clone your fork and `cd` into it locally
3. Create an empty heroku app called <app-name>
    * `heroku create <app-name>`
4. Add heroku as a remote to your fork
    * `git remote add heroku git@heroku.com:<app-name>.git`
5. Set ENV vars for
    * `heroku config: set ROOT_URL=https://<app-name>.herokuapp.com DISABLE_WEBSOCKETS=true`
6. Create the MONGO addon:
    * `heroku addons:create mongolab:sandbox`
7. Create a Procfile in the root directory of this repo and define the web process
    * `touch Procfile && echo "web: .meteor/heroku_build/bin/node .meteor/heroku_build/app/main.js" >> Procfile`
8. Push the public branch to heroku
    * `git push heroku public:master`
