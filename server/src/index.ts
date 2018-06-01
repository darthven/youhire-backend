import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as Router from 'koa-router'
import env from './config/env.config'

const app: Koa = new Koa()

app.use(async (ctx: Koa.Context) => {
    ctx.body = 'YouHire!'
})

app.listen(env.PORT, (): void => {
  console.log(`HTTP Server listening on port: ${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
})