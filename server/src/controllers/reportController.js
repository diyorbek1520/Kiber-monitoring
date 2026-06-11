// PDFKit tahlil natijalaridan PDF hisobot yaratish uchun ishlatiladi.
import PDFDocument from 'pdfkit';

// Analysis modeli hisobotga kerakli tahlil yozuvlarini bazadan olish uchun ishlatiladi.
import { Analysis } from '../models/Analysis.js';

export async function getReports(req, res) {
  const items = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ hisobotlar: items });
}

export async function downloadReport(req, res) {
  const item = await Analysis.findOne({ _id: req.params.id, userId: req.user._id }).lean();
  if (!item) {
    res.status(404).json({ xabar: 'Hisobot topilmadi' });
    return;
  }

  const doc = new PDFDocument({ margin: 48 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=hisobot-${item._id}.pdf`);
  doc.pipe(res);
  doc.fontSize(18).text('Kiberxavfsizlik hisoboti');
  doc.moveDown();
  doc.fontSize(11).text(`Turi: ${item.turi}`);
  doc.text(`Sana: ${new Date(item.createdAt).toLocaleString('uz-UZ')}`);
  if (item.ball !== undefined) doc.text(`Ball: ${item.ball}`);
  if (item.xavfDarajasi) doc.text(`Baho: ${item.xavfDarajasi}`);
  doc.moveDown();
  doc.text(JSON.stringify(item.natija, null, 2), { width: 500 });
  doc.end();
}
