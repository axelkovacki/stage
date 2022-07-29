import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import composer from './composer';
import { getSubdomain } from './utils';

async function middleware(req: Request, res: Response, next: any) {
  const targets: any = {};
  const subdomain = getSubdomain(req.get('host'));
  
  if (!targets[subdomain]) {
    // await composer.up(subdomain);

    targets[subdomain] = {
      status: 'UP'
    };
  }
  
  return next();
}

function isFrontProxy(pathname: string, req: Request) {
  return req.get('Stage-Proxy-Target') !== 'back';
}

function isBackProxy(pathname: string, req: Request) {
  return req.get('Stage-Proxy-Target') === 'back';
}

function serve() {
  const app: Express = express();
  const port = process.env.PORT;
  const { FRONT_PROXY_TARGET, BACK_PROXY_TARGET } = process.env;

  app.use((req, res, next) => middleware(req, res, next));
  app.use('/', createProxyMiddleware(isFrontProxy, {
    target: FRONT_PROXY_TARGET,
    changeOrigin: true,
  }));
  app.use('/', createProxyMiddleware(isBackProxy, {
    target: BACK_PROXY_TARGET,
    changeOrigin: true,
  }));
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

export default {
  serve
}