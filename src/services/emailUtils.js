const devUrl = import.meta.env.VITE_API_DEV_URL;
const prodUrl = import.meta.env.VITE_API_PROD_URL;
const buildEnv = import.meta.env.VITE_BUILD_ENV;
const baseUrl = buildEnv === 'prod' ? prodUrl : devUrl;

const emailPatient = (note, patientName, patientEmail) => {
  const { author, date, content, summary } = note;
  const emailContent = `
  Dear ${patientName},

  I hope this email finds you well. Here's a summary of your recent visit:

  Author: ${author}
  Date: ${date}
  Summary: ${summary}

  ${content}

  If you have any questions or concerns, please don't hesitate to contact us.

  Best regards,
  ${author}
  `;

  fetch(`${baseUrl}email/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      patientEmail,
      emailContent
    })
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
};

export default emailPatient;
