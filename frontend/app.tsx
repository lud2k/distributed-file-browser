import * as React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { DirectoryPage } from './directory/page'
import { FilePage } from './file/page'
import { ImagePage } from './image/page'

const useStyles = makeStyles(() => ({
  '@global': {
    html: {
      padding: 0,
      margin: 0,
    },
    body: {
      padding: 0,
      margin: 0,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
}))

export const App: React.FunctionComponent = () => {
  useStyles()
  return (
    <HashRouter basename="/">
      <div>
        <Switch>
          <Route path="/directory/:path(.*)" render={() => <DirectoryPage />} />
          <Route path="/file/:path(.*)" render={() => <FilePage />} />
          <Route path="/image/:path(.*)" render={() => <ImagePage />} />
          <Redirect to="/directory/" />
        </Switch>
      </div>
    </HashRouter>
  )
}
