# BarePNG [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

BarePNG is a little app we built to turn our Baremetrics SVGs into slick PNGs for our [Slack Bot](https://slack.com/apps/A0PSKV32Q-baremetrics) and now-gorgeous emails. Download, serve and enjoy or just use our little free standing [demo](https://barepng.herokuapp.com) to snag a few quick graph PNGs every now and again.

## How it works

The app itself is actually very simple. We have one page at `/chart` that hosts the svg, drawn from a small JavaScript file using the url queries.

With that page in place all we have to do is call the `/api` url with the appropriate queries and PhantomJS will take care of the rest.

Just look! `https://barepng.herokuapp.com/api?start=14579804&data=[0,100]&symbol=^%`
![BarePNG Image](https://barepng.herokuapp.com/api?start=14579804&data=[0,100]&symbol=^%25)

## Base keys
**`data`**
> `Array` of values starting with an initial value and proceeding with additional values which will be added on to the previous summarized value (i.e `data=100,50,-10` // 100, 150, 140)

```js
data=[43991,101,47,78,-14,-30,-5,12,9,-3]
```

**`start`**
> 8 digit number to start the graph on, will be added unto just like data with the `step` value 

```js
// Math.round(new Date().getTime()/100000)
start=14579804
```

**`step`**
> Number to add onto the iteration from the `start` value. Default is `864`, one day

```js
// day = 864
// week = 6048
// 30 day = 25920
step=864
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
goal=[14578940,43891,14588444,44271]
```

## Example URLs
> Base "Slack" graph

```
?start=14579804&data=[43991,101,47,78,-14,-30,-5,12,9,-3]&symbol=$^
```

> Base "Email" w/goal

```
?style=email&start=14579804&data=[43991,101,47,78,-14,-30,-5,12,9,-3]&w=600&h=250&goal=[14578940,43891,14588444,44271]
```

> Nice large % based graph with 7 day (week) steps

```
?start=14579804&step=6048&data=[0,100]&w=1200&h=600&symbol=^%
```
