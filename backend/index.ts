import * as Express from 'express'
import * as config from './config'

type Request = Express.Request
type Response = Express.Response<string>

export const index = async (req: Request, res: Response) => {
  try {
    const script = config.isDev ? 'http://localhost:9000/frontend.js' : 'frontend.js'
    const frontendConfig = {
      rootDirName: config.rootDirName,
      filePreviewSize: config.filePreviewSize,
    }
    res.send(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${config.title}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.13.1/umd/react.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js"></script>
        </head>
        <body>
          <script type="application/javascript">
            window.config = ${JSON.stringify(frontendConfig)};
          </script>
          <script src="${script}"></script>
        </body>
      </html>
      `
    )
  } catch (e) {
    console.error('Error rendering index', e)
    res.send('Error rendering index: ' + e)
  }
}
