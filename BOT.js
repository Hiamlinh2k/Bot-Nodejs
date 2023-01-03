//module
const {ethers} = require('ethers')
const InputDataDecoder = require('ethereum-input-data-decoder');
const fs = require('fs')


//import data
var inputjson = fs.readFileSync('config.json');
var datajson = JSON.parse(inputjson.toString())
var inputabi = fs.readFileSync('abi.txt');

//wallet
const address = datajson.Address
const privateKey = datajson.Privatekey
const wallet = new ethers.Wallet(privateKey)

//connect
const provider = new ethers.providers.WebSocketProvider(datajson.Node);
const signer = wallet.connect(provider)

//Router
const routerAddress = datajson.Router
const routerAbi = inputabi.toString()
const routerContract = new ethers.Contract(routerAddress, routerAbi, signer)

//decode
const decoder = new InputDataDecoder(routerAbi);

//function
const funtionrouter1 = datajson.Funtionrouter1;
const funtionrouter2 = datajson.Funtionrouter2;
const funtiontoken = datajson.Funtiontoken;

//addresses
const WBNB = datajson.WBNB;
const BUSD = datajson.BUSD
const USDT = datajson.USDT
const TokenToBuy = datajson.TokenToBuy
const link = datajson.Explorer

//wbnb to spend
const spend = ethers.utils.parseEther(datajson.Value)

async function mempool(){
    provider.on("pending", async(tx)=>{

        const txInfo = await provider.getTransaction(tx);
        try
        {  
            const functiondata = txInfo.data.slice(0,10)

                                                                                    //ADD LIQUIDITY ETH
            if(txInfo.to == routerAddress && functiondata == funtionrouter1)

                {   
                    const result = decoder.decodeData(txInfo.data);
                    const tokenA = '0x'+result.inputs[0];
                    console.log(tokenA)
                    fs.writeFileSync('Contract.txt',tokenA);
                }

                                                                                    //ADD LIQUIDITY BUSD OR USDT
            if (txInfo.to == routerAddress && functiondata == funtionrouter2)

                {   
                                                                                    //DECODE Token A and token B
                    const result = decoder.decodeData(txInfo.data);
                    const tokenA = '0x'+result.inputs[0];
                    const tokenB = '0x'+result.inputs[1];

                                                                                    //ADD LP BUSD
                    if ((tokenB == USDT) || (tokenB == USDT))
                    {
                        console.log(tokenA)
                    }

                                                                                    //ADD LP USDT
                    if ((tokenA == BUSD) || (tokenA == BUSD))
                    {
                        console.log(tokenB)

                    }
                    else{
                        console.log("Không phải token !")
                    }

                }


            else 
                {
                    console.log("Đang chờ !!!")
                }

            }

        catch{
            console.log("Lỗi ,vui lòng thử lại !!!")
            }
    })
}

mempool()