const formatTime = (date = new Date(), linker = '/', format = 'YMDHMS') => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  if ('YMDHMS' == format){
    return [year, month, day].map(formatNumber).join(linker) + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else if ('YMDHM' == format){
    return [year, month, day].map(formatNumber).join(linker) + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}

const formatMD = e => {
  let date = new Date(e * 1000)
  let month = date.getMonth() + 1
  let day = date.getDate()
  console.log(month, day)
  return `${month}月${day}日`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}




const countdown = date => {
  let timestamp = parseInt((date * 1000 - new Date().getTime()) / 1000)
  let hour = parseInt(timestamp / 3600).toString().padStart(2, 0)
  let minute = parseInt(timestamp % 3600 / 60).toString().padStart(2, 0)
  let second = parseInt(timestamp % 60).toString().padStart(2, 0)
  return `${hour}:${minute}:${second}`
}
const countdownDay = date => {
  let timestamp = parseInt((date * 1000 - new Date().getTime()) / 1000)
  let day = parseInt(timestamp / (24 * 3600)).toString().padStart(1, 0)
  let hour = parseInt(timestamp / 3600 % 24).toString().padStart(2, 0)
  let minute = parseInt(timestamp % 3600 / 60).toString().padStart(2, 0)
  let second = parseInt(timestamp % 60).toString().padStart(2, 0)
  return `${day}天${hour}时${minute}分${second}秒`
}
module.exports = {
  formatTime: formatTime,
  countdown: countdown,
  countdownDay,
  formatMD
}
