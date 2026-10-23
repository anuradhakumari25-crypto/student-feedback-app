export const create = async (req,res)=>{
    try{
        const store = await Feedback.create(res.body)
        res.status(201).josn({
            messsage :"feedback not found"
        })
        res.status(200).json({
            messsage:"sucessfully"
        })
    }catch(error){
        res.status(404).json({
            messsage:"error"
        })

    }
}

export const update = async (req,res)=>{
    const update = await Feedback.update(res.body)
    res.status(201).json({
        messsage:"feedback"
    })
}