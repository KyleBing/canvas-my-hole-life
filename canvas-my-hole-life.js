/**
 * 我的一生
 * MyHoleLife
 * @author: KyleBing(kylebing@163.com)
 * @github: https://github.com/KyleBing/canvas-my-hole-life
 * @date-init: 2023-12-06
 * @date-update: 2023-12-06
 * @version: v0.0.1
 * @platform: NPM
 */

let  LIFE_PHASE = [
    {name: '小学', dayRange: [], ageRange: [8, 14], color: 'green',  text: '小'},
    {name: '中学', dayRange: [], ageRange: [14,17], color: 'orange', text: '中'},
    {name: '高中', dayRange: [], ageRange: [17,20], color: 'red',  text: '高'},
    {name: '打工', dayRange: [], ageRange: [20,22], color: 'purple',  text: '工'},
    {name: '大学', dayRange: [], ageRange: [22,25], color: 'blue',   text: '大'},
    // {name: '退休', dayRange: [], ageRange: [65,75], color: 'blue',   text: '休'},
]

class CanvasMyHoleLife {
    /**
     * Timeline
     * @param name {String}主题名
     * @param isShowSerialNumber {Boolean} 是否显示序号
     * @param isShowCanvasInfo {Boolean} 是否显示 canvas 信息
     */
    constructor(name, isShowSerialNumber, isShowCanvasInfo)
    {
        this.holeLifeAge = 75
        this.now = new moment()
        this.dateBirth = new moment('1991-03-09 05:46:00')
        this.daysPassed = this.now.diff(this.dateBirth, 'days')
        this.dateDie = this.dateBirth.clone()
        this.dateDie.add(this.holeLifeAge, 'year')
        this.daysHoleLife = this.dateDie.diff(this.dateBirth, 'days')
        this.ageLeft = this.dateDie.diff(this.now, 'year')

        LIFE_PHASE.forEach(item => {
            item.ageRange.forEach((year,index) => {

                let tempMoment = this.dateBirth.clone()
                tempMoment.add(year, 'year')
                item.dayRange[index] = tempMoment.diff(this.dateBirth, 'days')
            })
        })

        console.log(LIFE_PHASE)

        this.isPlaying = false // 默认自动播放
        this.isShowCanvasInfo = isShowCanvasInfo
        this.isShowSerialNumber = isShowSerialNumber
        this.columnOffsetXFirst = 400 // 第一列的开始，偏移量

        this.baseX = 600
        this.bgColor = 'white'

        this.frame = {
            width : 1920 * 2,
            height: 1080 * 2,
        }

        this.lastTime = new Date().getTime() // 用于计算每帧用时

        this.init()
        window.onresize = () => {
            this.frame.height = innerHeight * 2
            this.frame.width = innerWidth * 2
            let canvasLayer = document.querySelector('canvas')
            this.updateFrameAttribute(canvasLayer)
            // this.init()
        }
    }

    updateFrameAttribute(canvasLayer){
        canvasLayer.setAttribute('id', 'canvasLayer')
        canvasLayer.setAttribute('width', this.frame.width)
        canvasLayer.setAttribute('height', this.frame.height)
        canvasLayer.style.width = `${this.frame.width / 2}px`
        canvasLayer.style.height = `${this.frame.height / 2}px`
        canvasLayer.style.zIndex = '-3'
        canvasLayer.style.userSelect = 'none'
        canvasLayer.style.position = 'fixed'
        canvasLayer.style.top = '0'
        canvasLayer.style.left = '0'
        canvasLayer.imageSmoothingEnabled = true

        // fill background
        let ctx = canvasLayer.getContext('2d')
        ctx.fillStyle = this.bgColor
        ctx.fill()

        this.draw()
    }

    init(){
        this.frame.height = document.documentElement.clientHeight * 2
        this.frame.width = document.documentElement.clientWidth * 2

        let canvasLayer = document.createElement("canvas")
        document.documentElement.append(canvasLayer)
        this.updateFrameAttribute(canvasLayer)

        this.draw()
    }

    draw(scrollOffset) {
        this.timeLine = this.timeLine + 1
        let canvasLayer = document.getElementById('canvasLayer')
        let c = canvasLayer.getContext('2d')
        c.clearRect(0,0,this.frame.width, this.frame.height)

        // 背景
        c.save()
        c.fillStyle = 'white'
        c.fillRect(0,0,this.frame.width, this.frame.height)
        c.restore()

        let lastPosX = 20
        let lastPosY = 20
        const gapVertical = 15
        const gapHorizontal = 15
        for (let i=0;i<this.daysHoleLife;i++){

            lastPosX = lastPosX + gapHorizontal
            if (lastPosX + gapVertical > this.frame.width) {
                lastPosX = 20
                lastPosY = lastPosY + gapVertical
            }
            c.save()
            c.beginPath()

            if (this.daysPassed < i){ // 未过的时间
                let finalText = '〇'
                let finalColor = 'gray'
                let finalFont = `14px sans-serf`
                LIFE_PHASE.forEach(phase => {
                    if (i >= phase.dayRange[0] && i < phase.dayRange[1]){
                        if (i === phase.dayRange[0]){ // 每个阶段的第一个字
                            finalFont = `bold 40px sans-serf`
                            finalText = `${phase.name} ( ${phase.ageRange[1] - phase.ageRange[0]}年 )`
                            finalColor = phase.color
                        } else {
                            finalText = phase.text
                            finalColor = phase.color
                        }
                    }
                })
                c.font = finalFont
                c.fillStyle = finalColor
                c.fillText(`${finalText}`, lastPosX, lastPosY)
            } else { // 已过的日期
                let finalText = '田'
                let finalColor = 'black'
                let finalFont = `14px sans-serf`
                LIFE_PHASE.forEach(phase => {
                    if (i >= phase.dayRange[0] && i < phase.dayRange[1]){
                        if (i === phase.dayRange[0]){ // 每个阶段的第一个字
                            finalFont = `bold 40px sans-serf`
                            finalText = `${phase.name} ( ${phase.ageRange[1] - phase.ageRange[0]}年 )`
                            finalColor = phase.color
                        } else {
                            finalColor = phase.color
                            finalText = phase.text
                        }
                    }
                })
                c.font = finalFont
                c.fillStyle = finalColor
                c.fillText(`${finalText}`, lastPosX, lastPosY)

            }


            c.restore()
        }

        // 展示 canvas 数据
        if (this.isShowCanvasInfo) {
            showCanvasInfo(c, this.frame, this.daysHoleLife, this.daysPassed, this.ageLeft)
        }

        if (this.isPlaying) {
            window.requestAnimationFrame(() => {
                this.draw()
            })
        }
    }

    animationStart(){
        if (this.isPlaying){

        } else {
            this.isPlaying = true
            this.draw()
        }
    }
    animationStop(){
        this.isPlaying = false
    }

    destroy(){
        this.isPlaying = false
        let canvasLayer = document.getElementById('canvasLayer')
        canvasLayer.remove()
        console.log('动画已停止')
    }
}

/**
 * ## 显示时间标线序号
 * @param ctx
 * @param timeline {''}
 * @param frame {{width, height}}
 */
function showCanvasInfo(ctx, frame, daysAll, daysPassed, ageLeft){
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.font = '20px sans-serf'
    ctx.fillRect(10, frame.height - 53, 220, 30)
    ctx.fillStyle = 'black'
    ctx.fillText(`${daysPassed}/${daysAll}  |  剩${daysAll - daysPassed}天 - ${ageLeft}年    1格 = 1天`, 20, frame.height - 32)
    ctx.restore()
}


/**
 *
 * @param ctx
 * @param center
 * @param radius {Number}
 * @param color {String}
 */

/**
 * ## 画点
 * @param ctx
 * @param center {{x: Number,y: Number}}
 * @param radius  {Number}
 * @param lineWidth {Number}
 * @param fillColor  {String}
 * @param strokeColor {String}
 */
function drawDot(ctx, center, radius, lineWidth, fillColor, strokeColor){
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(center.x + radius, center.y)
    ctx.lineWidth = lineWidth || 0
    ctx.strokeStyle = fillColor || 'black'
    ctx.fillStyle =  strokeColor || 'white'
    ctx.arc(center.x, center.y, radius,0, Math.PI * 2 )
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
}

/**
 * ## 获取第 index 个元素的 y 位置
 * @param middleLineY {{x: Number, y: Number}} 中心线的 y 位置
 * @param itemSize {Number}元素数量
 * @param gap {Number} 每个元素之间的间隔
 * @param index {Number} 第几个元素的位置
 */
function getYPositionOf(middleLineY, itemSize, gap, index){
    let gapCount = itemSize - 1 // gap 总数量
    let middleIndex = gapCount / 2
    if (index >= middleIndex){
        return middleLineY + (index - middleIndex) * gap
    } else {
        return middleLineY - (middleIndex - index) * gap
    }
}

/**
 * ## 在 a 与 d 点之间线一条带圆角的拆线
 * @param ctx canvas.context
 * @param pointA {{x: Number, y: Number}} 起点坐标
 * @param pointD {{x: Number, y: Number}} 末端坐标
 * @param radius  { Number } 圆角半径
 * @param endLineLength  { Number } 末端线段长度
 * @param lineWidth { Number } 线段宽度
 * @param lineColor  { String } 线段颜色
 */
function drawArcLine(ctx, pointA, pointD, radius,  endLineLength, lineWidth, lineColor){
    ctx.save()
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.lineJoin = 'round'
    ctx.moveTo(pointA.x, pointA.y)
    let foldX = pointA.x + (pointD.x - pointA.x - endLineLength)
    ctx.arcTo(
        foldX,
        pointA.y,
        foldX,
        pointD.y,
        radius
    )
    ctx.arcTo(
        foldX,
        pointD.y,
        pointD.x,
        pointD.y,
        radius
    )
    ctx.lineTo(pointD.x, pointD.y)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineWidth
    ctx.stroke()
    ctx.restore()
    return foldX
}


function getColor(timeLine){
    return `hsla(${timeLine%360 + 200},150%,50%,1)`
}

/**
 * 输出随机 1 或 -1
 * @returns {number}
 */
function randomDirection(){
    let random = Math.random()
    if (random > 0.5){
        return 1
    } else {
        return -1
    }
}

function randomPosition(width, height){
    return [
        Number((width * Math.random()).toFixed(0)),
        Number((height * Math.random()).toFixed(0))
    ]
}

/**
 * 数组乱序算法
 * @param arr
 * @return {*}
 */
function shuffle(arr) {
    let length = arr.length,
        r = length,
        rand = 0;

    while (r) {
        rand = Math.floor(Math.random() * r--);
        [arr[r], arr[rand]] = [arr[rand], arr[r]];
    }
    return arr;
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomInt(min, max){
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @returns {number}
 */
function randomFloat(min, max){
    return Number(Math.random() * (max - min) + min)
}


// 格式化时间，输出字符串
function dateFormatter(date, formatString) {
    formatString = formatString || 'yyyy-MM-dd hh:mm:ss'
    let dateRegArray = {
        "M+": date.getMonth() + 1,                      // 月份
        "d+": date.getDate(),                           // 日
        "h+": date.getHours(),                          // 小时
        "m+": date.getMinutes(),                        // 分
        "s+": date.getSeconds(),                        // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds()                     // 毫秒
    }
    if (/(y+)/.test(formatString)) {
        formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let section in dateRegArray) {
        if (new RegExp("(" + section + ")").test(formatString)) {
            formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? (dateRegArray[section]) : (("00" + dateRegArray[section]).substr(("" + dateRegArray[section]).length)))
        }
    }
    return formatString
}

function dateProcess(dateString) {
    let date = new Date(dateString)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let week = date.getDay()
    let timeLabel = ''
    if (hour >= 23 && hour < 24 || hour <= 3 && hour >= 0) {
        timeLabel = '深夜'
    } else if (hour >= 19 && hour < 23) {
        timeLabel = '晚上'
    } else if (hour >= 14 && hour < 19) {
        timeLabel = '傍晚'
    } else if (hour >= 11 && hour < 14) {
        timeLabel = '中午'
    } else if (hour >= 6 && hour < 11) {
        timeLabel = '早上'
    } else if (hour >= 3 && hour < 6) {
        timeLabel = '凌晨'
    }

    return {
        year,
        day,
        month,
        weekday: WEEKDAY[week],
        weekShort: WEEKDAY_SHORT[week],
        dateShort:`${padNumberWith0(month)}-${padNumberWith0(day)}`,
        date:`${padNumberWith0(month)}月${padNumberWith0(day)}日`,
        dateFull: `${year}年${month}月${day}日`,
        dateFullSlash: `${year}/${month}/${day}`,
        timeLabel: timeLabel,
        time: `${padNumberWith0(hour)}:${padNumberWith0(minutes)}`
    }
}
