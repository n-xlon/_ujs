
document.getElementById('downloadFile').onclick = () => {
  ujs.downloadFile({
    url: 'http://127.0.0.1:8080/IMG_1347.JPG',
    method: 'get',
    headers: {token: '423lj4klj323423l'},
    progressCallback
  })
}

function progressCallback(precent) {
  document.getElementsByClassName('num')[0].innerText = precent + '%'
}

function changeFile () {
  let dom = document.getElementsByTagName('input')[0].files
  console.log(dom)
}