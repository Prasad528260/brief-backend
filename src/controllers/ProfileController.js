import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    return res.status(200).json({
      data: {
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      status: 200,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({status: 500,message:"Profile retrieval failed"})
  }
};

export const updateName = async (req, res) => {
  try{const { name } = req.body;
  const user = req.user;
  if (!name) {
    console.log("FIELD CAN'T BE EMPTY");
    return res.status(401).json({ status: 401, message: "Field can't be empty" });
  }
  const updatedUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { name },
    { new: true }
  );
  res.status(200).json({
    data: updatedUser,
    status: 200,
    message: "Name updated successfully",
  });}
  catch(error){
    console.log(error)
    return res.status(500).json({status: 500,message:"Name update failed"})
  }
};
