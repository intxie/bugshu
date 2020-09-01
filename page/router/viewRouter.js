/**
 * Created by VULCAN on 2020/8/26.
 */
const router=require('express').Router();
const db = require("./sqlHelp");
router.get('/',(req,res)=>{
    res.render("index.html");
});
router.get("/index.html",(req,res)=>{
    let sql="select * from banner where keyName='lun'";
    db.query(sql,[],function(err,data){
        let sql2=`SELECT product.*,productrule.id FROM product JOIN productrule ON product.id=productrule.productId
WHERE isNew=1 AND isDefault=1 `;
        db.query(sql2,[],(err2,data2)=>{
            if(req.session.user){
                res.render('index',{user:req.session.user,
                    headImage:req.session.info.HeadImage,
                    lunbo:data,
                    newList:data2
                });
            }else{
                res.render("index",{user:req.session.user,
                    lunbo:data,
                    newList:data2
                })
            }
        });

    })

});
router.get("/product.html",(req,res)=>{
    res.render("product.html");
});
router.get("/user.html",(req,res)=>{
    //res.render("user",{userList:});
    let sql = "select * from user1";
    db.query(sql,[],function(err,data){
        res.render("user.html",{userList:data});
    });
});
router.get("/productDetail.html",(req,res)=>{
    let rid=req.query.id;
    let sql =`select * from product as p join productrule as r
    on p.id=r.productId where r.id=?  `;
    db.query(sql,[rid],function(err,data){
        res.render("productDetail.html",{info:data[0],
            user:req.session.user,
            headImage:req.session.headImage
        });

    });
});
router.get("/cart.html",(req,res)=>{

    if(req.session.user){
        let userId=req.session.info.id;
        let sql=`SELECT s.id AS sid,p.feng,p.title,r.price,s.num,r.Id AS rid FROM shopcart s JOIN productrule r
        ON s.ruleid=r.id JOIN product p
        ON r.productId=p.id where userId=? `;
        db.query(sql,[userId],(err,data)=>{
            res.render("cart",{user:req.session.user,
                headImage:req.session.headImage,
                productList:data
            });


        });

    }else{
        res.redirect("/index.html");
    }
});

module.exports=router;

