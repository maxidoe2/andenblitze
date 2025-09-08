import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // ✅ CORS dinámico
const allowedOrigins = [
  'https://andenblitze.com',
  'https://www.andenblitze.com',
  'https://andenblitze.web.app',
  'https://andenblitzecontactapi.vercel.app'
];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ✅ Preflight response
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Solo se permiten solicitudes POST' });
  }


  // Lógica de envío de correo
  const { firstName, lastName, phone, email, Country, message } = req.body;

  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ZOHO_EMAIL,
    to: 'hello@andenblitze.com',
    cc: process.env.ZOHO_EMAIL,
    subject: `Nuevo mensaje de contacto de ${firstName} ${lastName}`,
    text: `
    Nombre: ${firstName}
    Apellido: ${lastName}
    Teléfono: ${phone}
    Email: ${email}
    País: ${Country}
    Mensaje: ${message}
    `,
  };

   try {
    await mailTransport.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
