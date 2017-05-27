const aws = require ('aws-sdk');

//calback will take 2 argument err and returnData
const S3_BUCKET = process.env.S3_BUCKET ;

var signRequestForRoom= (room,fileName, fileType, callback) => {
  const s3= new aws.S3();
  const s3Params = {
  Bucket:S3_BUCKET,
  Key:`${room}/${fileName}`,
  Expires:60,
  ContentType: fileType,
  ACL:'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return callback(err);
    }

    const returnData={
      signedRequest: data,
      url:`https://${S3_BUCKET}.s3.amazonaws.com/${room}/${fileName}`
    };
    callback(undefined, returnData);


  });

}

var getAllFilesForRoom = (room, callback) => {

  const s3 = new aws.S3();

  const s3Params = {
    Bucket:S3_BUCKET,
    Prefix:room
  };

  s3.listObjects(s3Params, (err, data) => {
      if(err){
        return callback(err);
      }
      callback(undefined, data.Contents);

  });

};

var deleteRoomFiles = (room, callback) =>{
  const s3 = new aws.S3();
  const s3Params = {
      Bucket: S3_BUCKET
  };

  getAllFilesForRoom(room, (err, files)=>{
    if(err){
      return callback(err);
    }

    if(files.length <=0){
      return callback(undefined,{'status':'ok'});
    }
    s3Params.Delete = {Objects:[]};
    files.forEach((file)=>{
      s3Params.Delete.Objects.push({
        Key: `${file.Key}`
      });
    });
    console.log(s3Params);
    s3.deleteObjects(s3Params, (err, data) => {
      if (err) return callback(err);

      if(data.Deleted.length == 1000)deleteRoomFiles(room,callback);
       callback(undefined, {'status':'ok'});

    })
  });


};


module.exports = {signRequestForRoom, deleteRoomFiles, getAllFilesForRoom};
