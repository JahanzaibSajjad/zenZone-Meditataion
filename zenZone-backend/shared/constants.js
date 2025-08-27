const forgetPassSubject = "Password Reset Link - Balanced Healing for Heroes";

const forgetPassText = (link) => {
  return `Visit the following link to reset your password\n
  ${process.env.ADMIN_URL}/auth/reset-password/${link}`;
};

const getNutritionEmailContent = (body) => {
  return `Name: ${body.name}\nPhone Number: ${
    body.number ? body.number : "N/A"
  }\nEmail: ${body.email}\nMessage: ${body.msg}`;
};

const NUTRITION_EMAIL_SUBJECT = `Nutrition Recovery Consultation Form Submission`;

module.exports = {
  forgetPassSubject,
  forgetPassText,
  getNutritionEmailContent,
  NUTRITION_EMAIL_SUBJECT,
};
