(async () => {


    // init
    const storage = new Storage('myDatabaseName')

    // upload text
    await storage.upload('myText.txt', 'title\ncontent')

    // upload a json
    const obj = { hello: "world" }
    await storage.upload('myFolder/myJson.json', obj)

    // list directory
    const list = await storage.list('/')
    console.log(list) // [{ url, name, isFile }, ...]

    // upload an image element
    const image = new Image()
    image.src = 'https://picsum.photos/id/237/200/300' //! must be cross origin allowed
    await storage.upload('myImage.jpg', image)

    // upload a canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 100
    canvas.height = 50
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    await storage.upload('myFolder/myCanvas.png', canvas)

    // delete folder
    // await storage.delete('myFolder')

    // delete whole database
    // await storage.delete()
})()

