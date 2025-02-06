
//m1 through Promise.resolve().catch()
const asyncHandler = (requestHandler)=> {
  (req,res,next)=>(
   Promise.resolve(requestHandler(req,res,next))
  .catch((err)=>{
    return next(err);
  })
  )

}



//m2 by try catch

/*
const asyncHandler = (requestHandler) => (req,res,next) =>{
  
    try
    {
        await requestHandler(req,res,next)
    
    }
    catch(err)
    {
        res.status(err.code || 500).json(
          {
              success:false,                          THis need not to be written everytime so handling it thorugh Error class of node
              message:err.message
          }
        )
    }
  }


*/

export {asyncHandler}
