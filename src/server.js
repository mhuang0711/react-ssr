import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import App from './client/App';
import Html from './client/Html';
import routes from "./routes";
import { renderToString } from "react-dom/server";
import About from "./component/About";

import path from 'path';
import fs from 'fs';
const router = express.Router()

const port = 3000;
const server = express();
const filePath = './src/component';

// read files name
function getRouterPathPromise(path) {
  return new Promise((resolve, reject) => {
    let routePaths = [];
    fs.readdir(path, function (err, items) {
      if (err != null) {
        reject(err);
      } else {
        items.forEach(function (file) {
          if (fs.statSync(path + "/" + file).isDirectory()) {
            let fullPath = "/" + file;
            routePaths.push(fullPath);
            // return <Route path={file} component={getComponent(fullPath, file, true)}>
            //   {getRoutes(path + "/" + file)}
            // </Route>;
            // return routePaths;
          } else {
            const fileName = file.substr(0, file.length - 3);
            const fullPath = path + "/" + file;


            let text = fs.readFileSync(fullPath, 'utf8');
            console.log('component', text);
            const fileInfo = {
              name: fileName,
              path: "/" + fileName
            };

            routePaths.push(fileInfo);
          }
        });
        resolve(routePaths);
      }
    });
  });
}
// generate <a> element
function getNavPromise(paths) {
  return new Promise((resolve, reject) => {
    let nav = [];
    if (paths) {
      paths.forEach((fileInfo) => {
        nav.push(<a href={fileInfo.path}>{fileInfo.name}</a>);
      });

      resolve(ReactDOMServer.renderToString(nav));
    }
  })
}
function getComponentPromise(paths) {
  if (paths) {
    paths.forEach((path) => {

    })
  }
}
// async router info
async function getNavigation() {
  let paths = await getRouterPathPromise(filePath);
  let nav = await getNavPromise(paths);
  let routes = {
    paths: paths,
    nav: nav,
    components: [{
      path: '/App',
      content: ReactDOMServer.renderToString(<App />)
    }
    ]
  }
  return routes;
}
// return: [{path: '', formattedComponet}]
async function generateRouter() {
  let routes = await getNavigation();
  let routeForSSR = [];
  const title = 'Server side Rendering with Styled Components';

  const nav = routes.nav,
    paths = routes.paths,
    components = routes.components;

  components.forEach((component) => {
    const serverRenderer = (req, res, next) => {
      const body = component.content;
      return res.send(
        Html({
          nav,
          body,
          title
        })
      );
    }
    let routeInfo = {
      path: component.path,
      component: serverRenderer
    }
    routeForSSR.push(routeInfo);

  })

  return routeForSSR;
  // server.use(express.static(path.resolve(__dirname, "../dist")));
}

generateRouter().then((routes) => {
  console.log('path', routes);
  const serverRenderer1 = (req, res, next) => {
    const body = ReactDOMServer.renderToString(<About />);
    return res.send(
      Html({

        body
      })
    );
  }
  routes.forEach((route) => {

    router.get(route.path, route.component);
  });

  router.get('/', serverRenderer1);

  // router.get('/About.js', serverRenderer1);
  router.use(
    express.static(path.resolve(__dirname, '..', 'dist'), { maxAge: '30d' })
  )


  server.use(router);


  server.listen(port, () => {
    console.log(`SSR running on port http://localhost:${port}`)
  });

});






