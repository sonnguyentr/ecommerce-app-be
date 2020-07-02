const nodemailer = require("nodemailer");
const transport = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "sonnt.test@gmail.com", // generated ethereal user
        pass: "test4321", // generated ethereal password
    },
};
const sendMail = async (to, subject, html) => {
    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(transport);

        // send mail with defined transport object
        await transporter.sendMail({
            from: '"Shop 🛒😎" <sonnt.test@gmail.com>', // sender address
            to: to || "sonnt@dgroup.co", // list of receivers
            subject, // Subject line
            html,
        });
        console.log("Email sent to " + to);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { sendMail };
