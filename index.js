const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const SLOT_SIZE = 3;
const launchOptions = {
    headless: true
}
let parsedData = {}

async function download(url,output){
    return new Promise((resolve,reject) => {
        const log = fs.createWriteStream("downloads.log", {flags: "a"})
        const cmd = "ffmpeg";
        const args = [
            "-protocol_whitelist", "file,http,https,tcp,tls",
            "-i",url,
            output
        ]

        const process = spawn(cmd, args)

        process.stdout.pipe(log);
        process.stderr.pipe(log);

        process.on("close", (code) => resolve(`child process exited with code ${code}`))
        process.on("error", reject)
        process.on('uncaughtException', reject);
    });
    
}

async function main() {
    const browser = await puppeteer.launch(launchOptions);

    let page = await browser.newPage();
    //LOGIN PHASE
    await page.goto('https://ariel.unimi.it/');
    await page.type('#tbLogin', parsedData.credentials.username)
    await page.type('#tbPassword', parsedData.credentials.password)
    await page.type('#ddlType', parsedData.credentials.domain)
    await page.click("form button[type='submit']")
    launchOptions.headless && await page.waitForNavigation()
    

    const toDownload = (await Promise.all(parsedData.material.map(async(info) => {
        let newPage = await browser.newPage();
        await newPage.goto(info.url)

        await newPage.$$eval("button",  
            (button) => button
                .filter(e => e.innerHTML === "Visualizza video")
                .forEach(e => e.click())
        );  

        const urls = await newPage.$$eval("video source", 
            (source) => source
                .map(e => e.getAttribute("src"))
        );

        let regex = info["regex"] ?? "mp4:(.*?)\/";
        return urls.map(e => {
            const name = new RegExp(regex).exec(e)
            return {
                    url: e,
                    filename: path.join(info.basedir, decodeURIComponent(name[1]))
                };
        }).filter(e => !fs.existsSync(e.filename));
    })))
    .flat();

    await browser.close();

    console.log(`${toDownload.length} videos to download`)

    for (let index = 0; index < Math.ceil(toDownload.length / SLOT_SIZE); index++) {
        const next = toDownload.slice(index * SLOT_SIZE, (index+1) * SLOT_SIZE);
        await Promise.all(next.map(async e => {
            console.log(`Start download ${e.filename}`)
            const res = await download(e.url, e.filename)
            console.log(`Finish download ${e.filename}\n${res}`)
            return;
        }))
    }

}

const [syncFile] = process.argv.slice(2)

if(fs.existsSync(syncFile)){
    try {
        let data = fs.readFileSync(syncFile)
        parsedData = JSON.parse(data);
        main();
    } catch (error) {
        console.error(error)
    }
}