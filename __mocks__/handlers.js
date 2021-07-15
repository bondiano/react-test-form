import { rest } from 'msw';

const URL = 'https://postman-echo.com/post';

const postmanPost = rest.post(URL, (req, res, ctx) => res(ctx.status(200)));

export const handlers = [postmanPost];

export const errorHandler = rest.post(URL, (_, res, ctx) => res(ctx.status(500)));
