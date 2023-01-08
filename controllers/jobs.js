const jobsModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError,NotFoundError } = require("../errors");

const getAllJobs = async (req,res) => {
  const jobs = await jobsModel.find({createdBy:req.user.userId});
  res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async (req,res) => {
  const { userId } = req.user;
  const { id:jobId } = req.params

  const job = await jobsModel.findOne({
    _id: jobId,
    createdBy: userId
  })

  if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job })
}

const createJob = async (req,res) => {
  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async (req,res) => {
  const { userId } = req.user;
  const { id:jobId } = req.params;
  const { company,position } = req.body;

  if(!company || !position){
    throw new BadRequestError("Company and Position must be provided")
  }

  const job = await jobsModel.findOneAndUpdate({_id:jobId,createdBy:userId},req.body, {
    new:true,
    runValidators:true
  })

  if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req,res) => {
  const { userId } = req.user;
  const { id:jobId } = req.params;

  const job = await jobsModel.findByIdAndRemove({_id: jobId,createdBy:userId})

  if(!job){
    throw new NotFoundError(`No job found with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ msg: "Job deleted successful" })
}

module.exports =  {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}