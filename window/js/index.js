/* Configs */
const Configs = {
  imageSrc: '../img/window.jpeg',
  canvasSizeRatio: 2,
  verticalOffset: 10
}

/* Constants & Variables */
const Canvas = document.getElementById('canvas')
const Ctx = Canvas.getContext('2d')
let OriginalImageData, CurrentImageData

/* Init */
loadImage(Configs.imageSrc, _ => {
  verticalShift(Configs.verticalOffset)
})

/* Functions */
function loadImage (imageSrc, callback) {
  const img = new Image()
  img.addEventListener('load', function () {
    Canvas.width = img.width * Configs.canvasSizeRatio
    Canvas.height = img.height * Configs.canvasSizeRatio
    Ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      0, 0, Canvas.width, Canvas.height
    )
    OriginalImageData = Ctx.getImageData(
      0, 0, Canvas.width, Canvas.height
    )
    callback()
  })
  img.src = imageSrc
}

function verticalShift (offset) {
  const indexOffset = offset * Canvas.width * 4
  const imageData = Ctx.createImageData(
    Canvas.width, Canvas.height
  )
  for (let i = 0; i < imageData.data.length; i += 4) {
    let destIndex = i + indexOffset
    if (destIndex < 0) {
      destIndex += imageData.data.length
    } else if (destIndex >= imageData.data.length) {
      destIndex -= imageData.data.length
    }
    imageData.data[i] = OriginalImageData.data[destIndex]
    imageData.data[i + 1] = OriginalImageData.data[destIndex + 1]
    imageData.data[i + 2] = OriginalImageData.data[destIndex + 2]
    imageData.data[i + 3] = 255
  }
  Ctx.putImageData(imageData, 0, 0)
}
