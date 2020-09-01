/**
 * Created by VULCAN on 2020/8/25.
 */
const myexpress=require('express');
const favicon=require('serve-favicon');
const logger=require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const ejs=require('ejs');
const viewRouter=require('./router/viewRouter');
const userRouter=require('./router/userRouter');
const productRouter=require("./router/producRouter");
const app=myexpress();

app.use(logger('dev'));

app.set('views',__dirname+'/view');
app.engine('html',ejs.__express);
app.set('view engine','html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
    secret:'12345',
    name:'testapp',//这里的name值是cookie的name，默认  cookie的name是：connect.sid
    cookie:{maxAge:8000000},
    rolling:true,
    resave:true
}));
app.use(userRouter);
app.use(viewRouter);
app.use(productRouter);

app.use(myexpress.static(__dirname+"/public"));
app.use(favicon(__dirname+'/public/favicon.ico'));



app.listen(5555);
console.log("服务启动");