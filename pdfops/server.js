const express = require('express')
const path = require('path')
const app = express()
const multer = require('multer')
const { mergePdfs } = require('./merge')
var docxConverter = require('docx-pdf');
const sharp = require('sharp')
// const { PDFNet } = require('@pdftron/pdfnet-node')
// const Docxtemplater = require('docxtemplater');
// const PDFPrinter = require('pdfmake');
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
app.use('/static', express.static('public'))
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "templates/index.html"))
})
app.get('/')
app.post('/merge', upload.array('pdfs', 10), async (req, res, next) => {
    console.log(req.files)
    let d = new Date().getTime()
    for (i = 0; i < ((req.files).length); i++) {
        await mergePdfs(path.join(__dirname, req.files[i].path), d)

    }
    // await mergePdfs(path.join(__dirname,req.files[0].path),path.join(__dirname,req.files[1].path))
    res.redirect(`http://localhost:3000/static/${d}merged.pdf`)
    // res.send({data:req.files})
    // req.body will contain the text fields, if there were any
})
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "templates/index.html"))
// })
app.post('/wordupload', upload.single('wordfile'), async (req, res, next) => {
    console.log(req.file)
    let d = new Date().getTime()
    docxConverter(path.join(__dirname, req.file.path), path.join(__dirname, `./public/${d}converted.pdf`), function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('result' + result);
        res.redirect(`http://localhost:3000/static/${d}converted.pdf`)
    });
})
var format;
app.post('/jpgupload', upload.single('jpgfile'), async (req, res, next) => {
    console.log(req.file)
    format = req.body.format
    if (req.file) {
        console.log(req.file.path)
        let d = new Date().getTime()
        outputFilePath = path.join(__dirname, `./public/${d}converted-to-png.png`);
        await sharp(req.file.path)
        .toFile(outputFilePath, (err, info) => {
            if (err) throw err;
            res.redirect(`http://localhost:3000/static/${d}converted-to-png.png`)
            if (err) throw err;
            
        });
        // fs.unlinkSync(req.file.path);
        // fs.unlinkSync(outputFilePath);
    }
})
var format;
app.post('/pngupload', upload.single('pngfile'), async (req, res, next) => {
    console.log(req.file)
    format = req.body.format
    if (req.file) {
        console.log(req.file.path)
        let d = new Date().getTime()
        outputFilePath = path.join(__dirname, `./public/${d}converted-to-jpg.jpg`);
        await sharp(req.file.path)
        .toFile(outputFilePath, (err, info) => {
            if (err) throw err;
            res.redirect(`http://localhost:3000/static/${d}converted-to-jpg.jpg`)
            if (err) throw err;
            
        });
        // fs.unlinkSync(req.file.path);
        // fs.unlinkSync(outputFilePath);
    }
})
// function convertWordToPDF(wordFilePath, pdfFilePath) {
//     // Load the Word file
//     const docxFile = fs.readFileSync(wordFilePath);

//     // Create a new Docxtemplater instance
//     const docxtemplater = new Docxtemplater();
//     docxtemplater.loadZip(docxFile);

//     // Perform the document processing
//     docxtemplater.render();

//     // Generate a buffer containing the processed document
//     const processedDocx = docxtemplater.getZip().generate({ type: 'nodebuffer' });

//     // Create a new PDF printer instance
//     const printer = new PDFPrinter();

//     // Define the fonts used in the PDF
//     const fonts = {
//         Roboto: {
//             normal: 'node_modules/pdfmake/build/vfs_fonts.js',
//             bold: 'node_modules/pdfmake/build/vfs_fonts.js',
//             italics: 'node_modules/pdfmake/build/vfs_fonts.js',
//             bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
//         }
//     };

//     // Register the fonts with the printer
//     printer.registerFonts(fonts);

//     // Load the processed document into a readable stream
//     const docDefinition = { content: [{ data: processedDocx }] };

//     // Create a new PDF document
//     const pdfDoc = printer.createPdfKitDocument(docDefinition);

//     // Save the PDF to the specified file path
//     const pdfStream = fs.createWriteStream(pdfFilePath);
//     pdfDoc.pipe(pdfStream);
//     pdfDoc.end();

//     return new Promise((resolve, reject) => {
//         pdfStream.on('finish', () => {
//             resolve(pdfFilePath);
//         });

//         pdfStream.on('error', (error) => {
//             reject(error);
//         });
//     });
// }
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "templates/index.html"))
// })
// // Define the route for file upload
// app.post('/upload', upload.single('wordfile'), (req, res) => {
//     const wordFilePath = req.file.path;
//     const pdfFilePath = `public/${req.file.filename}.pdf`;

//     convertWordToPDF(wordFilePath, pdfFilePath)
//         .then((outputFilePath) => {
//             res.download(outputFilePath, () => {
//                 // Clean up the uploaded files after download
//                 fs.unlinkSync(wordFilePath);
//                 fs.unlinkSync(outputFilePath);
//             });
//         })
//         .catch((error) => {
//             console.error('Error converting Word to PDF:', error);
//             res.status(500).send('Error converting Word to PDF');
//         });
// });
// app.post('/upload',upload.single('wordfile'), (req, res) => {
//     const {filename} = req.query;
//     // let ext = path.parse(filename).ext;

//     const inputPath = path.resolve(__dirname,`./uploads/${filename}`);
//     const outputPath = path.resolve(__dirname,`./public/${filename}.pdf`);

//     // if (ext === '.pdf') {
//     //   res.statusCode = 500;
//     //   res.end(`File is already PDF.`);
//     // }

//     const convertToPDF = async () => {
//       const pdfdoc = await PDFNet.PDFDoc.create();
//       await pdfdoc.initSecurityHandler();
//       await PDFNet.Convert.toPdf(pdfdoc, inputPath);
//       pdfdoc.save(
//         outputPath,
//         PDFNet.SDFDoc.SaveOptions.e_linearized,
//       );
//     //   ext = '.pdf';
//     };

//     res.redirect('http://localhost:3000/static/converted.pdf')
//   });
// app.post('/upload',upload.single('wordfile'),(req,res)=>{
//     const {filename} = req.query
//     const inputPath=path.resolve(__dirname,`./uploads/${filename}`)
//     const outputPath=path.resolve(__dirname,`./public/${filename}.pdf`)

//     const convertToPDF = async()=>{
//         const pdfdoc=await PDFNet.PDFDoc.create()
//         await pdfdoc.initSecurityHandler()
//         await PDFNet.Convert.toPDF(pdfdoc,inputPath)
//         pdfdoc.save(outputPath,PDFNet.SDFDoc.SaveOptions.e_linearized)
//     }
//     PDFNet.runWithCleanup(convertToPDF).then(()=>{
//         fs.readFile(outputPath,(err,data)=>{
//             if(err){
//                 res.statusCode=500
//                 res.end(err)
//             }
//             else{
//                 res.setHeader('ContentType','application/pdf')
//                 res.end(data);
//             }
//         })
//     }).catch(err=>{
//         res.statusCode = 500;
//         res.end(err)
//     })
// })
app.post('/submit',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    res.send('Form submitted successfully!');
})
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})