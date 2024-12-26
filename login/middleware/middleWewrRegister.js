const middleLog = require("./middleWareLogin");

async function getList(req,res,next){
    let q=`SELECT * FROM \`users\``;
    db_pool.query(q, function(err, rows, fields){
        if(err)
        {
            res.status(500).json({message: err})
        }
        else
        {
            res.status(200).json(rows );
        }
    });
    next();
}

async function Adduser(req,res,next){
    let{userName,email,name}=req.body;
    let pass = middleLog.EncWithSalt(req.body.pass);
    let Query = "INSERT into users";
    Query+="(name,userName,pass,email)";
    Query+= " VALUES ";
    Query+=`('${name}','${userName}','${pass}','${email}')`;
    console.log("adding user",Query);
    db_pool.query(Query, function (err, rows, fields) {
        if (err) {
            res.status(500).json({message: err})
        }else{
            return res.render("regSuccessful")
        }
    });
    next();
}

async function UpdateUser(req,res,next){
    let id = req.body.idOffUp;
    let name = req.body.nameOffUp;
    let userName = req.body.userNmaeOffUp;
    let pass = req.body.passOffUp;
    let email = req.body.emailOffUp;
    let q=`UPDATE \`users\`  SET \`name\`='${name}',\`userName\`= '${userName}',\`pass\`= '${pass}',\`email\`= '${email}' WHERE id=${id} `;
    db_pool.query(q, function(err, rows, fields){
        if(err){
            res.status(500).json({message: err})
        }else{
            res.status(200).json({message: "OK"});
        }
    });
    next();
}
async function delUser(req,res,next){
    let id=req.params.row_id;
    let q=`DELETE FROM \`users\` WHERE id='${id}' `;
    db_pool.query(q, function(err, rows, fields){
        if(err){
            res.status(500).json({message: err})
        }else{
            res.status(200).json({message: "OK"});
        }
    });
    next();
}

module.exports = {
    getList:getList,
    Adduser:Adduser,
    UpdateUser:UpdateUser,
    delUser:delUser
};

