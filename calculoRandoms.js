let obj = {}
process.on('message', mensaje => {
    if(mensaje == 'start') {
        for(let i = 0; parseInt(process.argv[2]) > i; i++) {
            if(obj[Math.floor(Math.random() * (1000 - 1)) + 1]) {
                obj[Math.floor(Math.random() * (1000 - 1)) + 1]++ 
            } else {
                obj[Math.floor(Math.random() * (1000 - 1)) + 1] = 1;
            }
        }
        process.send(JSON.stringify(obj))
    }
})