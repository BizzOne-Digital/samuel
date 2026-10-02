import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

async function testSmtp() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const to = process.env.SMTP_TO || user;

  console.log('\n📧 SMTP Test\n');
  console.log(`Host:   ${host}:${port}`);
  console.log(`User:   ${user || '(missing)'}`);
  console.log(`From:   ${from || '(missing)'}`);
  console.log(`To:     ${to || '(missing)'}`);
  console.log(`Pass:   ${pass ? '✅ set' : '❌ missing'}\n`);

  if (!user || !pass) {
    console.error('❌ SMTP_USER and SMTP_PASS are required in .env.local');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  console.log('1) Verifying SMTP connection...');
  await transporter.verify();
  console.log('   ✅ Connection verified\n');

  console.log('2) Sending test email...');
  const info = await transporter.sendMail({
    from: `"Samuel Louis Jean Publications" <${from}>`,
    to,
    subject: 'SMTP Test — Samuel Louis Jean Publications',
    text: [
      'This is a test email from the Samuel Louis Jean Publications website.',
      '',
      `Sent at: ${new Date().toISOString()}`,
      '',
      'If you received this, SMTP is working correctly.',
    ].join('\n'),
    html: `
      <p>This is a <strong>test email</strong> from the Samuel Louis Jean Publications website.</p>
      <p>Sent at: ${new Date().toISOString()}</p>
      <p>If you received this, SMTP is working correctly.</p>
    `,
  });

  console.log(`   ✅ Test email sent`);
  console.log(`   Message ID: ${info.messageId}\n`);
  console.log(`Check inbox: ${to}\n`);
}

testSmtp().catch((error) => {
  console.error('\n❌ SMTP test failed:\n');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
