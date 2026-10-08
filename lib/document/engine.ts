/** Client-side spreadsheet / document conversion helpers. Heavy deps loaded via dynamic import. */

export const DOC_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const DOC_MAX_PDF_ROWS = 500;
export const DOC_MAX_PDF_COLS = 20;

export type SheetMatrix = string[][];

function assertFileSize(file: File) {
  if (file.size > DOC_MAX_BYTES) {
    throw new Error(`File is too large (max ${DOC_MAX_BYTES / (1024 * 1024)} MB).`);
  }
}

function cellStr(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return String(v);
}

export async function readXlsxAsMatrix(file: File, sheetIndex = 0): Promise<{ name: string; rows: SheetMatrix }> {
  assertFileSize(file);
  const XLSX = await import('xlsx');
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const name = wb.SheetNames[sheetIndex] || wb.SheetNames[0];
  if (!name) throw new Error('Workbook has no sheets.');
  const sheet = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' }) as unknown[];
  return {
    name,
    rows: rows.map((r) => (Array.isArray(r) ? r.map(cellStr) : [cellStr(r)])),
  };
}

export async function readCsvAsMatrix(file: File): Promise<SheetMatrix> {
  assertFileSize(file);
  const Papa = (await import('papaparse')).default;
  const text = await file.text();
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
  if (parsed.errors?.length) {
    throw new Error(parsed.errors[0]?.message || 'Failed to parse CSV.');
  }
  return (parsed.data || []).map((row) => (Array.isArray(row) ? row.map(cellStr) : [cellStr(row)]));
}

export async function matrixToCsvBlob(rows: SheetMatrix): Promise<Blob> {
  const Papa = (await import('papaparse')).default;
  const csv = Papa.unparse(rows);
  return new Blob([csv], { type: 'text/csv;charset=utf-8' });
}

export async function matrixToXlsxBlob(rows: SheetMatrix, sheetName = 'Sheet1'): Promise<Blob> {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || 'Sheet1');
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  return new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function matrixToPdfBlob(rows: SheetMatrix, title = 'Table'): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const margin = 36;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margin * 2;
  const limited = rows.slice(0, DOC_MAX_PDF_ROWS).map((r) => r.slice(0, DOC_MAX_PDF_COLS));
  const colCount = Math.max(1, ...limited.map((r) => r.length));
  const colW = usableW / colCount;
  const fontSize = colCount > 10 ? 7 : colCount > 6 ? 8 : 9;
  const lineH = fontSize + 4;
  let y = margin;

  doc.setFontSize(11);
  doc.text(title, margin, y);
  y += 18;
  doc.setFontSize(fontSize);

  for (let ri = 0; ri < limited.length; ri++) {
    const row = limited[ri];
    let rowMaxLines = 1;
    const cells: string[][] = [];
    for (let ci = 0; ci < colCount; ci++) {
      const raw = (row[ci] ?? '').replace(/\s+/g, ' ').trim();
      const lines = doc.splitTextToSize(raw || ' ', colW - 4) as string[];
      cells.push(lines);
      rowMaxLines = Math.max(rowMaxLines, lines.length);
    }
    const blockH = rowMaxLines * lineH + 4;
    if (y + blockH > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    if (ri === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y - 2, usableW, blockH, 'F');
    }
    for (let ci = 0; ci < colCount; ci++) {
      doc.text(cells[ci], margin + ci * colW + 2, y + fontSize);
    }
    y += blockH;
  }

  if (rows.length > DOC_MAX_PDF_ROWS || (rows[0]?.length || 0) > DOC_MAX_PDF_COLS) {
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Truncated for PDF: max ${DOC_MAX_PDF_ROWS} rows × ${DOC_MAX_PDF_COLS} columns.`,
      margin,
      pageH - 16
    );
  }

  return doc.output('blob');
}

/** Extract plain text from a .docx (OOXML) via JSZip — layout/images not preserved. */
export async function extractDocxText(file: File): Promise<string> {
  assertFileSize(file);
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file('word/document.xml')?.async('string');
  if (!xml) throw new Error('Not a valid Word .docx (missing word/document.xml).');

  const paras: string[] = [];
  const paraRe = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  const textRe = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let pMatch: RegExpExecArray | null;
  while ((pMatch = paraRe.exec(xml))) {
    const chunk = pMatch[0];
    const parts: string[] = [];
    let tMatch: RegExpExecArray | null;
    textRe.lastIndex = 0;
    while ((tMatch = textRe.exec(chunk))) {
      parts.push(
        tMatch[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
      );
    }
    paras.push(parts.join(''));
  }
  const text = paras.join('\n').trim();
  if (!text) throw new Error('No readable text found in this Word document.');
  return text;
}

export async function textToPdfBlob(text: string, title = 'Document'): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  doc.setFontSize(12);
  doc.text(title, margin, y);
  y += 20;
  doc.setFontSize(10);

  const paragraphs = text.split(/\n/);
  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para.length ? para : ' ', maxW) as string[];
    for (const line of lines) {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    }
  }

  return doc.output('blob');
}
