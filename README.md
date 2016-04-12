# BarePNG
> Generate PNGs from Baremetrics SVGs
>
> `?start=14579804&step=864&data=43991,101,47,78,-14,-30,-5,12,9,-3&symbol=$^&w=600&h=250&email=1&goal=14579804,43891,14587580,44271`

Source: https://dashboard.baremetrics.com/chart  
Base:   https://barepng.herokuapp.com  
CDN:    https://chart.baremetricscdn.com  

## Base keys
**`data`**
> `Array` of arrays

```js
data=[[1456358399000,43991],[1456444799000,44192],[1456531199000,44289],[1456617599000,44367],[1456703999000,44413],[1456790399000,44443],[1456876799000,44791],[1456963199000,44789],[1457049599000,45138],[1457135999000,45173],[1457222399000,45159],[1457308799000,45191],[1457395199000,45372],[1457481599000,45357],[1457567999000,45408],[1457654399000,45458],[1457740799000,45845],[1457827199000,45889],[1457913599000,45939],[1457999999000,45983],[1458086399000,46054],[1458172799000,45443],[1458259199000,45707],[1458345599000,45170],[1458431999000,45301],[1458518399000,45298],[1458604799000,45384],[1458691199000,45741],[1458777599000,45741]]
```

**`w`**
> `Number`. Width of the generated graph and image. Default is `800`

```js
w=800
```

**`h`**
> `Number`. Height of the generated graph and image. Default is `400`

```js
h=400
```

## Slack keys
**`symbol`**
> `String`. Symbol for the x axis labels. Default is `''`

```js
symbol=%25
```

**`symbol_first`**
> `Boolean`. Would you like said symbol as the first or last character? Default is `true`. Set to `false` to move the symbol to the far right

```js
symbol_first=false
```

## Email keys
**`email`**
> `Boolean`. Set to `true` to switch SVG styling to it's email version counterpart

```js
email=true
```

**`goal`**
> `Array` of arrays. Likely only two though as a goal has definite start and end  
>  
> **note you will need to do the logic yourself to clamp the dates within the `data` range to ensure the goal doesn't extend beyond or before the existing date range. Be sure and do the math for the amounts on any new start/end dates!!*

```js
goal=[[1456358399000,42991],[1458777599000,44741]]
```