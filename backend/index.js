import { PrismaClient } from '@prisma/client'
import express from 'express'
import { nanoid } from 'nanoid'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/shorten', async (req,res) =>{
    const {url} = req.body;
    const shortId = nanoid(6)
    try {
        if(!url){
            return res.status(400).json({error: 'URL is required'})
        }
        const shortLink = await prisma.link.create({
            data: {
                url,
                shortLink: shortId
            }
        })
        res.json({shortUrl : `http://localhost:3000/${shortLink.shortLink}`})

    } catch (error) {
        res.status(500).json({error: 'Internal Server Error', error: error.message})
    }
})

app.get('/:shortLink', async (req,res) =>{
    const {shortLink} = req.params;
    try {
        const link = await prisma.link.findUnique({
            where: {
                shortLink
            }
        })
        if(!link){
            return res.status(404).json({error: 'Link not found'})
        }
        res.redirect(link.url)
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error', error: error.message})
    }
})

app.listen(3000, () =>{
    console.log('Server is running on port 3000')
})