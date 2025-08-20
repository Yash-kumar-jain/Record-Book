const { isLoggedIn } = require("../middlewares/auth-middleware");
const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-model");
const { all } = require("../routes/indexRouter");
const sendEmail = require(`../email`);

module.exports.createPageController = function(req,res){
    let message =req.flash('error2')
    res.render("create",{error:message});
}
module.exports.postCreateController = async function(req,res){
    let { title, description, encrypted, passcode, shareable, editable , important} = req.body;
    // console.log(title, description, encrypted, passcode, shareable, editpermissions)
    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on"? true : false;
    editable = editable === "on"? true : false;
    important = important === "on"? true : false;
    if (encrypted && !passcode) {
        
        req.flash("error2"," password is required")
        return res.redirect("/hisaab/create")
    }
    
    let hisaab = await hisaabModel.create({
        title,
        description,
        user:req.user._id,
        encrypted,
        passcode,
        shareable,
        important,
        editable,
    })
    
    let user = await userModel.findOne({email:req.user.email})
    user.hisaabs.push(hisaab._id)
    await user.save();

        const link = `https://record-book.onrender.com/hisaab/view/${req.params.id}`;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Record Created</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 95% !important;
          padding: 15px !important;
        }
        .title {
          font-size: 24px !important;
        }
        .thank-you {
          font-size: 20px !important;
        }
        .update-link {
          padding: 15px 20px !important;
        }
        .update-link a {
          font-size: 16px !important;
          padding: 12px 25px !important;
        }
      }
    </style>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <!-- Main container with shadow -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          <!-- Content container -->
          <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px; margin: 0 auto; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Header with gradient -->
            <tr>
              <td bgcolor="#2e8b57" style="background: linear-gradient(to right, #2e8b57, #3cb371); padding: 30px 20px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
<td style="text-align: center;">
  <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" 
                 style="width:80px;height:80px;v-text-anchor:middle;" arcsize="50%" 
                 strokecolor="#ffffff" fillcolor="#ffffff" fill="t">
      <v:textbox inset="0,0,0,0">
        <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:40px;">✓</center>
      </v:textbox>
    </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
    <div style="width:80px;height:80px;background-color:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto;display:table;text-align:center;">
      <span style="color:white;font-size:40px;display:table-cell;vertical-align:middle;line-height:80px;">✓</span>
    </div>
  <!--<![endif]-->
</td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Success message -->
            <tr>
              <td style="padding: 30px 30px 15px 30px; text-align: center;">
                <h1 class="title" style="font-size: 28px; color: #333; margin: 0 0 15px 0;">Success!  Record Updated</h1>
                <p style="font-size: 18px; color: #555; line-height: 1.6; margin: 0;">
                  The new record has been <strong style="color: #2e8b57;">successfully Created</strong> in our system.
                </p>
              </td>
            </tr>
            
            <!-- View Updates Link -->
            <tr>
              <td class="update-link" style="padding: 10px 30px; text-align: center;">
                <table align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius: 50px; background: linear-gradient(to right, #3498db, #2980b9); text-align: center;">
                      <!--[if mso]>
                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" 
                               href="${link}" style="height:48px;v-text-anchor:middle;width:220px;" 
                               strokecolor="#2980b9" fillcolor="#3498db">
                          <v:fill type="gradient" color="#3498db" color2="#2980b9" angle="90"/>
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;">
                            View Updated Record
                          </center>
                        </v:rect>
                      <![endif]-->
                      <a href="${link}"
                         style="background-color: #3498db; background: linear-gradient(to right, #3498db, #2980b9); border: 1px solid #2980b9; border-radius: 50px; color: #ffffff; display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; line-height: 48px; text-align: center; text-decoration: none; width: 220px; -webkit-text-size-adjust: none; mso-hide: all;">
                        View Record
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Thank you section -->
            <tr>
              <td style="padding: 20px 30px 30px 30px; text-align: center;">
                <p class="thank-you" style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 1px;">
                  THANK YOU
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="font-size: 14px; color: #777; margin: 0;">
                  This is an automated notification. Please do not reply to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>
`;


const userfind = await userModel.findOne({ _id: hisaab.user });


if(userfind.email == process.env.MY_EMAIL){

    
sendEmail(
  process.env.SENDER_EMAIL1,
  'Record Updated Successfully',
  'heyy! The RECORD BOOK has been updated.\n\nTHANK YOU',
  htmlContent
);
sendEmail(
  process.env.SENDER_EMAIL2,
  'Record Updated Successfully',
  'heyy! The RECORD BOOK has been updated.\n\nTHANK YOU',
  htmlContent
);
}


    res.redirect("/profile")
    
}
module.exports.showhisaabController = async function(req,res){
    let hisaab = await hisaabModel.findOne({_id:req.params.id})
    
    if (hisaab.encrypted && allowed === 0)  { 
        let error = req.flash('error')
        return res.render("passcode",{id:req.params.id,error});
    }
    // console.log(hisaab);
    allowed = 0
    let error = req.flash('error2')
    const nameOf = `${hisaab.title}`;
    sendEmail(
  process.env.SENDER_EMAIL1,
  'Record Updated Successfully',
  'heyy! The RECORD BOOK has been updated.\n\nTHANK YOU',
  `Someone is viewing the record " ${nameOf} "`
);
    res.render("hisaab",{hisaab,error});
}
module.exports.deletehisaabController = async function(req,res){
    let user = req.user
    let hisaab = await hisaabModel.findOne({_id:req.params.id})
    if (user.hisaabs.indexOf(req.params.id) === -1){
        req.flash("error2","You do not have permissions to delete this")
        return res.redirect(`/hisaab/view/${req.params.id}`)
    }
    user.hisaabs.remove(req.params.id)
    await user.save()
    await hisaabModel.deleteOne({_id:req.params.id})
    const deleteOf = `${hisaab.title}`;
    sendEmail(
  process.env.SENDER_EMAIL1,
  'Record deleted Successfully',
  'heyy! a record has been deleted.\n\nTHANK YOU',
  `the record "${deleteOf}"`
);
    res.redirect("/profile");
}

module.exports.edithisaabController = async function(req,res){
    let hisaab = await hisaabModel.findOne({_id:req.params.id,user:req.user._id})
    if (!hisaab){
        req.flash("error2","hisaab not found")
        return res.redirect(`/profile`)
    }

    return res.render("edit",{hisaab})
}

module.exports.updateHisaabController = async function(req,res){
    let hisaab = await hisaabModel.findOne({_id:req.params.id,user:req.user._id})
    if (!hisaab){
        req.flash("error2","hisaab not found")
        return res.redirect(`/profile`)
    }
    hisaab.title = req.body.title;
    hisaab.description = req.body.description;
    hisaab.encrypted = req.body.encrypted === "on"? true : false;
    hisaab.shareable = req.body.shareable === "on"? true : false;
    hisaab.editable = req.body.editable === "on"? true : false;
    await hisaab.save();

    
const link = `https://record-book.onrender.com/hisaab/view/${req.params.id}`;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Record Updated</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 95% !important;
          padding: 15px !important;
        }
        .title {
          font-size: 24px !important;
        }
        .thank-you {
          font-size: 20px !important;
        }
        .update-link {
          padding: 15px 20px !important;
        }
        .update-link a {
          font-size: 16px !important;
          padding: 12px 25px !important;
        }
      }
    </style>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <!-- Main container with shadow -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          <!-- Content container -->
          <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px; margin: 0 auto; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Header with gradient -->
            <tr>
              <td bgcolor="#2e8b57" style="background: linear-gradient(to right, #2e8b57, #3cb371); padding: 30px 20px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
<td style="text-align: center;">
  <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" 
                 style="width:80px;height:80px;v-text-anchor:middle;" arcsize="50%" 
                 strokecolor="#ffffff" fillcolor="#ffffff" fill="t">
      <v:textbox inset="0,0,0,0">
        <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:40px;">✓</center>
      </v:textbox>
    </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
    <div style="width:80px;height:80px;background-color:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto;display:table;text-align:center;">
      <span style="color:white;font-size:40px;display:table-cell;vertical-align:middle;line-height:80px;">✓</span>
    </div>
  <!--<![endif]-->
</td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Success message -->
            <tr>
              <td style="padding: 30px 30px 15px 30px; text-align: center;">
                <h1 class="title" style="font-size: 28px; color: #333; margin: 0 0 15px 0;">Success!  Record Updated</h1>
                <p style="font-size: 18px; color: #555; line-height: 1.6; margin: 0;">
                  The record has been <strong style="color: #2e8b57;">successfully updated</strong> in our system.
                </p>
              </td>
            </tr>
            
            <!-- View Updates Link -->
            <tr>
              <td class="update-link" style="padding: 10px 30px; text-align: center;">
                <table align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius: 50px; background: linear-gradient(to right, #3498db, #2980b9); text-align: center;">
                      <!--[if mso]>
                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" 
                               href="${link}" style="height:48px;v-text-anchor:middle;width:220px;" 
                               strokecolor="#2980b9" fillcolor="#3498db">
                          <v:fill type="gradient" color="#3498db" color2="#2980b9" angle="90"/>
                          <w:anchorlock/>
                          <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;">
                            View Updated Record
                          </center>
                        </v:rect>
                      <![endif]-->
                      <a href="${link}"
                         style="background-color: #3498db; background: linear-gradient(to right, #3498db, #2980b9); border: 1px solid #2980b9; border-radius: 50px; color: #ffffff; display: inline-block; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; line-height: 48px; text-align: center; text-decoration: none; width: 220px; -webkit-text-size-adjust: none; mso-hide: all;">
                        View Updated Record
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Thank you section -->
            <tr>
              <td style="padding: 20px 30px 30px 30px; text-align: center;">
                <p class="thank-you" style="font-size: 24px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 1px;">
                  THANK YOU
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="font-size: 14px; color: #777; margin: 0;">
                  This is an automated notification. Please do not reply to this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
</body>
</html>
`;

const userfind = await userModel.findOne({ _id: hisaab.user });


if(userfind.email == process.env.MY_EMAIL){

    
sendEmail(
  process.env.SENDER_EMAIL1,
  'Record Updated Successfully',
  'heyy! The RECORD BOOK has been updated.\n\nTHANK YOU',
  htmlContent
);
sendEmail(
  process.env.SENDER_EMAIL2,
  'Record Updated Successfully',
  'heyy! The RECORD BOOK has been updated.\n\nTHANK YOU',
  htmlContent
);
}

    res.redirect(`/hisaab/view/${req.params.id}`)
}
var allowed = 0;
module.exports.verifyhisaabController = async function(req,res){
    let hisaab = await hisaabModel.findOne({_id:req.params.id});
        if (req.body.passcode === hisaab.passcode){
            allowed = 1;
            return res.redirect(`/hisaab/view/${req.params.id}`)
        }
        else{
            allowed = 0;
            req.flash("error","wrong passcode")
            return res.redirect(`/hisaab/view/${req.params.id}`)
        }
    
    // else{
    //     res.redirect(`/hisaab/view/${req.params.id}`)
    // }
}



