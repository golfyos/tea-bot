
const responseData  = res =>{
  res.status(200)
  res.json({})
}

const makeTextMessageObj = data => ({
  "type" : "text",
  "text" : data
})

const makeStickerMessageObj = (sId,pId) => ({
  "type" : "sticker",
  "packageId" : pId,
  "stickerId" : sId
})

export {
  responseData,
  makeTextMessageObj,
  makeStickerMessageObj
}