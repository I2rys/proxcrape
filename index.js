(async()=>{
    "use strict";

    // Dependencies
    const request = require("request-async")
    const fs = require("fs")
    
    // Variables
    const types = ["http", "socks4", "socks5"]
    const args = process.argv.slice(2)
    
    // Functions
    async function getProxies(){
        var results = {
            http: [],
            socks4: [],
            socks5: []
        }

        for( const type of types ){
            const response = await request(`https://api.proxyscrape.com/v2/?request=displayproxies&protocol=${type}&timeout=10000&country=all&ssl=all&anonymity=all`)
            for( const proxy of response.body.replace(/\r/g, "").split("\n") ) results[type].push(`${type}://${proxy}`)
        }
    
        return results
    }

    // Main
    console.log("Scraping proxies, please wait...")
    const results = await getProxies()
    const name = Math.floor(Math.random() * 9999999)

    if(args[0]){
        fs.writeFileSync(`./out/${name}.txt`, `${results.http.join("\n")}\n${results.socks4.join("\n")}\n${results.socks5.join("\n")}`, "utf8")
    }else{
        for( const type of types ) fs.writeFileSync(`./out/${name}_${type}.txt`, results[type].join("\n"), "utf8")
    }

    args[0] ? console.log(`Proxies has been saved to out/${name}.txt`)  : console.log(`Proxies has been saved to out directory with the prefix of ${name}.`) 
})()