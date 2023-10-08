const CustomerRequest = require('../models/CustomerRequest');
const UserOnboarding=require("../models/UserOnboarding")
const ExcelJS = require('exceljs');
const mailgunTransport = require('nodemailer-mailgun-transport'); 
const nodemailer = require('nodemailer');


// Create a Nodemailer transporter using Mailgun SMTP transport
const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: '61f9d09eb4d0fa0fdd995c929ce3e78c-262b213e-430930e6', // Replace with your Mailgun API key
      domain: 'sandboxf15ad26e231547a3a3f009a154480958.mailgun.org', // Replace with your Mailgun domain
    },
  })
);

const sendStatusEmail = async (recipientEmail, status) => { 
  try {
    const mailOptions = {
      from: 'hr.jobminar@gmail.com', // Replace with your email address
      to: recipientEmail,
      subject: 'Service Status Update',
      text: `Your service status has been updated to ${status}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



const customerController = { 
  createRequest: async (req, res) => { 
    try {
      const { customerId, description } = req.body;
      const request = new CustomerRequest({ customerId, description });
      await request.save();
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const request = await CustomerRequest.findById(id);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error,message: 'Internal server error' });
    }
  },

  updateServiceStatus : async (req, res) => {
    try {
      const { id } = req.params;
      const { status,email} = req.body;
  
      // Send email notification to the customer
      const request = await CustomerRequest.findByIdAndUpdate(id, { status }, { new: true });
      // const customer = await User.findById(request.customerId);
      await sendStatusEmail(email, status);
  
      res.json({request,message:"Email sent successfully"});
    } catch (error) {
      res.status(500).json({ error,meesage: 'Internal server error' });
    }
  },

  createCustomer: async (req, res) => {
    try {
      const {
        name,
        mobile,
        email,
        mobileMake,
        mobileModel,
        imeiNumber,
        reference,
        issue,
        priceQuoted,
        advancePay,
        registeredDate,
        expectedDeliveryDate,
        comments,
      } = req.body;

      const user = new UserOnboarding({
        name,
        mobile,
        email,
        mobileMake,
        mobileModel,
        imeiNumber,
        reference,
        issue,
        priceQuoted,
        advancePay,
        registeredDate,
        expectedDeliveryDate,
        comments
      }); 
      await user.save();
      res.json({user,message:"Customer onboarded successfully"});

    } catch (error) {
      console.log(error);
      res.status(500).json({ error, message: 'Internal server error' });
    }
  },



  getCustomerReports: async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Assuming the date range is provided as query parameters
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const reports = await UserOnboarding.find({
        registeredDate: {
          $gte: start,
          $lte: end,
        },
      }).select('name registeredDate mobileModel issue priceQuoted advancePay devicedeliverystatus');
  
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error, message: 'Internal server error' });
    }
  },
  
  
  exportCustomerReports: async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Assuming the date range is provided as query parameters
      const start = new Date(startDate);
      const end = new Date(endDate);

      const reports = await User.find({
        registeredDate: {
          $gte: start,
          $lte: end,
        },
      }).select('name registeredDate mobileModel issue priceQuoted advancePay devicedeliverystatus');

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Customer Reports');

      // Add headers to the worksheet
      worksheet.addRow(['Name', 'Registered Date', 'Mobile Model', 'Issue', 'Quoted Price', 'Advance Payment', 'Delivery Status']);

      // Add data to the worksheet
      reports.forEach((report) => {
        worksheet.addRow([
          report.name,
          report.registeredDate,
          report.mobileModel,
          report.issue,
          report.priceQuoted,
          report.advancePay,
          report.devicedeliverystatus,
        ]);
      });

      // Generate the Excel file in memory
      const buffer = await workbook.xlsx.writeBuffer();

      // Set the appropriate headers for the response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=customer_reports.xlsx');

      // Send the generated Excel file as the response
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};


module.exports = customerController;
