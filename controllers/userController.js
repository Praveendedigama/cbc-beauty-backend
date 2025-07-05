import User from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
  const newUserData = req.body;

  if (newUserData.type === "admin") {
    if (!req.user) {
      res.json({
        message: "Please login as administrator to create admin accounts",
      });
      return;
    }

    if (req.user.type !== "admin") {
      res.json({
        message: "Please login as administrator to create admin accounts",
      });
      return;
    }
  }

  newUserData.password = bcrypt.hashSync(newUserData.password, 10);

  const user = new User(newUserData);

  user
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    });
}

export function loginUser(req,res){

  User.find({email : req.body.email}).then(
    (users)=>{
      if(users.length == 0){

        res.json({
          message: "User not found"
        })

      }else{

        const user = users[0]

        const isPasswordCorrect = bcrypt.compareSync(req.body.password,user.password)

        if(isPasswordCorrect){

          const token = jwt.sign({
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            isBlocked : user.isBlocked,
            type : user.type,
            profilePicture : user.profilePicture
          } , process.env.SECRET)
          
          res.json({
            message: "User logged in",
            token: token,
            user : {
              firstName : user.firstName,
              lastName : user.lastName,
              type : user.type,
              profilePicture : user.profilePicture,
              email : user.email
            }
          })
          
        }else{
          res.json({
            message: "User not logged in (wrong password)"
          })
        }
      }
    }
  )
}


//admin@gmail.com.com  
// PW: 123
//Admin token: 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbS5jb20iLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJpc0Jsb2NrZWQiOmZhbHNlLCJ0eXBlIjoiYWRtaW4iLCJwcm9maWxlUGljdHVyZSI6Imh0dHBzOi8vaW1nLmZyZWVwaWsuY29tL2ZyZWUtdmVjdG9yL3VzZXItYmx1ZS1ncmFkaWVudF83ODM3MC00NjkyLmpwZz90PXN0PTE3MzE3NzA4NDB-ZXhwPTE3MzE3NzQ0NDB-aG1hYz0wZjhhYzA3NGMyMzIxMjg5ZjYzODU4NzI4ZTA3M2MwZDU5NDZlYTZjYjU0MmMzYjI1OWE4OGUzNjdhN2RkZTI1Jnc9NzQwIiwiaWF0IjoxNzUxNzA3Mzk0fQ.cMFwITZipLHtlvFf_gBeY6MGFCENKH0Kyt2t4H8FEPQ


// cus acc
// {
//   "email": "praveen@gmail.com",
//   "password": "securePassword123"
//   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByYXZlZW5AZ21haWwuY29tIiwiZmlyc3ROYW1lIjoicHJhdmVlbiIsImxhc3ROYW1lIjoiaGFuc2EiLCJpc0Jsb2NrZWQiOmZhbHNlLCJ0eXBlIjoiY3VzdG9tZXIiLCJwcm9maWxlUGljdHVyZSI6Imh0dHBzOi8vaW1nLmZyZWVwaWsuY29tL2ZyZWUtdmVjdG9yL3VzZXItYmx1ZS1ncmFkaWVudF83ODM3MC00NjkyLmpwZz90PXN0PTE3MzE3NzA4NDB-ZXhwPTE3MzE3NzQ0NDB-aG1hYz0wZjhhYzA3NGMyMzIxMjg5ZjYzODU4NzI4ZTA3M2MwZDU5NDZlYTZjYjU0MmMzYjI1OWE4OGUzNjdhN2RkZTI1Jnc9NzQwIiwiaWF0IjoxNzUxNzA3NTI3fQ.qizjqvhNneb76hKmANEaF0JwPTiZsuMhXARfVTBBXFE
// }