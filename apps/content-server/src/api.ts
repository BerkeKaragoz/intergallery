import { RequestHandler } from "express"
import { existsSync, mkdirSync } from "fs"
import { dirname, resolve } from "path"
import sharp from "sharp"
import { SERVING_PATH } from "./index"

export const getFileThumb: RequestHandler = (req, res) => {
   const filePath = req.params[0]
   const absFilePath = resolve(SERVING_PATH, filePath)
   const absThumbPath = resolve(SERVING_PATH, "thumbnails", filePath)
   const absThumbDirPath = dirname(absThumbPath)

   if (!existsSync(absThumbDirPath)) {
      mkdirSync(absThumbDirPath, {
         recursive: true,
      })
   }

   if (!existsSync(absThumbPath))
      sharp(absFilePath)
         .resize(200, 200)
         .toFile(absThumbPath, (err) => {
            if (err) {
               console.error(err)
               res.sendStatus(500)
            } // else console.log(resizeImage);
            res.sendFile(absThumbPath, { maxAge: "2 days" })
         })
   else res.sendFile(absThumbPath, { maxAge: "2 days" })
}

export const getFile: RequestHandler = (req, res) => {
   const filePath = req.params[0]
   const absFilePath = resolve(SERVING_PATH, filePath)

   if (!existsSync(absFilePath))
      res.sendFile(absFilePath, (err) => err && res.sendStatus(500))
   else res.sendStatus(404)
}
