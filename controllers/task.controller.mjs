import Task from '../models/task.model.mjs';

export const getTasks=async (req,res)=>{
    const tasks=await Task.find({ userId: req.user.userId });
    res.json(tasks);
}

export  const postTask=async (req, res) => {
  try {
    const task = await Task.create({...req.body, userId: req.user.userId}
);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
export const updateTask=async(req,res)=>{
    const updateData=req.body
    const task=await Task.findOneAndUpdate(
  { _id: req.params.id, userId: req.user.userId },
  updateData,
  { new: true }
);
    console.log("Updated successfully");
    res.status(201).json(task);
}
export const deleteTask=async(req,res)=>{
    const task=await Task.deleteOne({_id:req.params.id, userId:req.user.userId });
        res.status(201).json(task);
}

