const {MongoClient} =  require('mongodb')

let dbConnection;

module.exports = {
    connectToDb : (cb)=>{
        MongoClient.connect('mongodb+srv://myChatAppInfo:tXBUm0avZ92wya4N@cluster0.lbnbpno.mongodb.net/chatAppInfo')
        .then((client)=>{
            dbConnection = client.db();
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    } ,

    getDb : ()=> dbConnection
}



