const directoryPath = 'C:/git_file/zip_test';
const locationZip = `${directoryPath}/raw`;
const locationUnZip = `${directoryPath}/unzip`;

const typeFile = '.zip';
const fs = require('fs');
const unzipper = require('unzipper');

async function app() {

  const directoryFiles = fs.readdirSync(locationZip);
  // let file = fs.createReadStream('C:/git_file/zip_test')

  for await (const file of directoryFiles) {
    if(file.indexOf(typeFile)>-1){

      const zipName = file.replace(".zip", "_");
      const zip = fs.createReadStream(`${locationZip}/${file}`).pipe(unzipper.Parse({forceStream: true}));
      let unzipSize = 0;
      let success_unzip = 0;
      for await (const entry of zip) {
        
        const type = entry.type; // 'Directory' or 'File'
        if(type=='File'){

          unzipSize = unzipSize+1;
          //success_unzip = success_unzip+1;

          success_unzip = success_unzip+await unzipProcess(zipName,entry);
          
          // if (fileName === "this IS the file I'm looking for") {
          //   entry.pipe(fs.createWriteStream('output/path'));
          // } else {
          //   entry.autodrain();
          // }

        }
      }

      let movePart = `${directoryPath}/error_unzip`;
      if(success_unzip==unzipSize){
        movePart = `${directoryPath}/backup`;
      }

      fs.rename(`${locationZip}/${file}`, `${movePart}/${file}`, function (err) {
        if (err) throw err
        console.log(`Successfully ${file} moved!`)
      })

    }

  }

}

async function unzipProcess(zipName,entry){
  return new Promise(async (resolve,reject) => {

    const fileName = entry.path;

    const size = entry.vars.uncompressedSize; // There is also compressedSize;
            
    entry.pipe(fs.createWriteStream(`${locationUnZip}/${zipName}${fileName}`))
    .on('finish',function(){
      console.log('unzip : ',fileName,size,'-done')
      resolve(1);
    })
    .on('error', function(err) { 
      console.log("ERROR:" + err);
      resolve(0) ;
    });

  });

}

app();