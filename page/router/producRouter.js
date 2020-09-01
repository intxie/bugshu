/**
 * Created by VULCAN on 2020/8/29.
 */
const router=require("express").Router();
const db=require("./sqlHelp");

router.post("/shopcart",(req,res)=>{
    var rid=req.body.rid;
    if(req.session.user){
        let userId=req.session.info.id;
        let sql2="select * from shopcart where userId=? and ruleId=?";
        db.query(sql2,[userId,rid],(err2,data2)=>{
            if(err2){

            }else{
                if(data2.length>0){
                    let sql ="update shopcart set num=num+1 where userId=? and ruleId=?";
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send({code:500,message:"数据库出错，请联系管理员"});
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"});
                            }else{
                                res.send({code:202,message:"加入失败"});
                            }
                        }
                    });

                }else{
                    let sql ="INSERT INTO shopcart(userId,ruleId) VALUES(?,?)";
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            res.send({code:500,message:"数据库出错，请联系管理员"});
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"});
                            }else{
                                res.send({code:202,message:"加入失败"});
                            }
                        }
                    });
                }
            }
        });

    }else{
        res.send({code:201,message:"请先登录"});
    }
});
router.post("/buildOrder",(req,res)=> {
    let sidStr = req.body.sidstr;
    let total = req.body.total;
    if (req.session.user) {
        let userid = req.session.info.id;

        let sql = "INSERT INTO shop.orders(userId,total) VALUES(?,?)";
        db.query(sql, [userid, total], (err, data)=> {
            if (err) {

                res.send({code: 500, message: "数据库出错11，请联系管理员"});
            } else {
                if (data.affectedRows > 0) {
                    let orderId = data.insertId;
                console.log(sidStr);
                    let sql2 = `INSERT INTO orderdetail(orderId,ruleId,num,price)
                                             SELECT ${orderId},s.ruleid,s.num,r.price
                                   FROM shopcart s JOIN productrule r
                              ON s.ruleid=r.id
                            WHERE s.id IN (${sidStr}) `;
                    db.query(sql2, [], (err2, data2)=> {
                        if (err2) {
                            res.send({code: 500, message: "数据库出错22，请联系管理员"});
                        } else {
                            let sql3 = ` DELETE FROM shopcart WHERE id IN (${sidStr}) `;
                            db.query(sql3, [], (err3,data3)=> {
                                if (err3) {
                                    res.send({code: 500, message: "数据库出错33，请联系管理员"});
                                } else {
                                    res.send({code: 200, message: "订单生成成功"});
                                }
                            })
                        }
                    });

                }
                else {
                    res.send({code: 200, message: "插入失败"});
                }
            }


        })
    }else
        {
            res.sen({code: 201, message: "请先登录"});
        }

});

module.exports=router;