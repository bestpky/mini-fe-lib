let simpleKoa = require('../lib/application');
let app = new simpleKoa();

let responseData = {};

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        console.log(err)
    }
});

app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    responseData.sex = 'male';
});

app.listen(3000, () => {
    console.log('listening on 3000');
});