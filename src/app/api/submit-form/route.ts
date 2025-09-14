
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, parentName, email, class: standard, message } = body;

    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const filePath = path.join(dataDir, 'admissions.xlsx');

    const workbook = new ExcelJS.Workbook();
    let worksheet;

    try {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet('Admissions');
      if (!worksheet) {
        worksheet = workbook.addWorksheet('Admissions');
        worksheet.columns = [
          { header: 'Student Name', key: 'studentName', width: 30 },
          { header: 'Parent Name', key: 'parentName', width: 30 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Class', key: 'standard', width: 10 },
          { header: 'Message', key: 'message', width: 50 },
        ];
      }
    } catch (error) {
      worksheet = workbook.addWorksheet('Admissions');
      worksheet.columns = [
        { header: 'Student Name', key: 'studentName', width: 30 },
        { header: 'Parent Name', key: 'parentName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Class', key: 'standard', width: 10 },
        { header: 'Message', key: 'message', width: 50 },
      ];
    }

    worksheet.addRow({ studentName, parentName, email, standard, message });

    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ message: 'Error submitting form' }, { status: 500 });
  }
}
