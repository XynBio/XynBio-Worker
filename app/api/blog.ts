import { commonResponse, getReqJsonData, ghGetReq, jsonResponse, jwtDetect } from '../../lib/utils'
import { Handler } from 'worktop'
import matter from 'gray-matter';

export const BlogListHandler: Handler = async function (req, res) {
    //if (!await jwtDetect(req)) return await commonResponse(res, 401)

    const fileList = await (await ghGetReq(`https://api.github.com/repos/${ARCHIVE_REPO}/contents/posts/blog`)).json()
    const fslJson = JSON.parse(JSON.stringify(fileList))
    const blogs = fslJson.map(async (fileJson: any) => {
        const fileName = fileJson.name
        const slug = fileName.replace('.md', '')
        const fileContent = await (await ghGetReq(`https://github.com/${ARCHIVE_REPO}/raw/main/posts/blog/${fileName}`)).text()
        const origmeta = matter(fileContent).data
        const link = NEXT_WEB_URL + '/blog/' + slug
        const metadata = {
            title: origmeta.title,
            subtitle: origmeta.subtitle,
            date: origmeta.date,
            author: origmeta.author,
            keyword: origmeta.keyword,
            slug: slug,
        }
        console.log(metadata)
        const DataArray = { link: link, metadata: metadata }
        return metadata
    })
    console.log(await blogs)
    const data = {
      code: 200,
      data: "1"
    }
  
    return await jsonResponse(res, 200, data)
}
  
export const BlogContentHandler: Handler = async function (req, res) {
    if (!await jwtDetect(req)) return await commonResponse(res, 401)
    const slug = req.params.slug

    const metadata = {
        title: 'Hello World',
        subtitle: 'This is a subtitle',
        date: '2021-01-01',
        author: 'John Doe',
        keyword: 'hello world',
        slug: slug,
    }
    const link = 'https://github.com'
    const content = 'This is the content of the post'
    const activity = {
        comments: 0,
        likes: 0,
        shares: 0
    }
    const DataArray = { link: link, metadata: metadata, content: content, activity: activity }
    const data = {
        code: 200,
        data: DataArray
    }

    return await jsonResponse(res, 200, data)
}

export const BlogCommentHandler: Handler =  async function (req, res){
    if (!await jwtDetect(req)) return await commonResponse(res, 401)
    const slug = req.params.slug

    const metadata = {
        title: 'Hello World',
        user: 'John Doe',
        github: 'https://github.com',
        date: '2021-01-01',
    }
    const link = 'https://github.com'
    const content = 'This is the content of the comment'
    const DataArray = [{ link: link, metadata: metadata, content: content }, { link: link, metadata: metadata, content: content }]
    const data = {
        code: 200,
        data: DataArray
    }

    return await jsonResponse(res, 200, data)
}