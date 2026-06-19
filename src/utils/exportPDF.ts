import jsPDF from 'jspdf';
import type { WeaponSystem } from '../types';

const ACCENT = [0, 212, 255] as const;
const BG_DARK = [7, 11, 15] as const;
const BG_PANEL = [14, 22, 30] as const;
const TEXT_WHITE = [255, 255, 255] as const;
const TEXT_MUTED = [136, 153, 170] as const;

const classColors: Record<string, [number, number, number]> = {
  'TOP SECRET': [255, 68, 68],
  'SECRET': [255, 136, 0],
  'CONFIDENTIAL': [255, 204, 0],
  'UNCLASSIFIED': [0, 212, 255],
};

function setColor(pdf: jsPDF, rgb: readonly [number, number, number]) {
  pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setFill(pdf: jsPDF, rgb: readonly [number, number, number]) {
  pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function setDraw(pdf: jsPDF, rgb: readonly [number, number, number]) {
  pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

async function loadImageAsDataURL(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportWeaponPDF(weapon: WeaponSystem) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  let y = 0;

  // ── Background ──────────────────────────────────────────────────────────────
  setFill(pdf, BG_DARK);
  pdf.rect(0, 0, W, H, 'F');

  // ── Classification Banner (Top) ───────────────────────────────────────────
  const cls = weapon.classification;
  const clsColor = classColors[cls] ?? ACCENT;
  setFill(pdf, clsColor);
  pdf.rect(0, 0, W, 8, 'F');
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(7, 11, 15);
  pdf.text(`// ${cls} // HANDLE VIA MILITARY CHANNELS ONLY //`, W / 2, 5, { align: 'center' });
  y = 10;

  // ── Header Bar ───────────────────────────────────────────────────────────────
  setFill(pdf, BG_PANEL);
  pdf.rect(0, y, W, 22, 'F');
  setDraw(pdf, ACCENT);
  pdf.setLineWidth(0.4);
  pdf.line(0, y + 22, W, y + 22);

  // Logo text
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  setColor(pdf, ACCENT);
  pdf.text('DATEWORLD', 10, y + 12);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, TEXT_MUTED);
  pdf.text('WEAPON MANAGEMENT SYSTEM  v2.0', 10, y + 17);

  // Weapon ID badge (right side)
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  setColor(pdf, ACCENT);
  pdf.text(weapon.id, W - 10, y + 10, { align: 'right' });
  pdf.setFontSize(6);
  setColor(pdf, TEXT_MUTED);
  pdf.text(`Generated: ${new Date().toISOString().slice(0, 19)} UTC`, W - 10, y + 16, { align: 'right' });
  y += 26;

  // ── Weapon Title ─────────────────────────────────────────────────────────────
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  setColor(pdf, TEXT_WHITE);
  pdf.text(weapon.name, 10, y + 12);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, TEXT_MUTED);
  pdf.text(`${weapon.designation}  ·  ${weapon.manufacturer}  ·  ${weapon.yearIntroduced}`, 10, y + 19);
  y += 24;

  // ── Image Section ──────────────────────────────────────────────────────────
  if (weapon.image) {
    const imgData = await loadImageAsDataURL(weapon.image);
    if (imgData) {
      const imgH = 55;
      const imgW = 95;
      // Image box
      setFill(pdf, [10, 18, 26]);
      setDraw(pdf, [0, 60, 80]);
      pdf.setLineWidth(0.3);
      pdf.rect(10, y, imgW, imgH, 'FD');
      try {
        pdf.addImage(imgData, 'JPEG', 10, y, imgW, imgH);
      } catch {
        // image failed, keep placeholder
      }

      // Status badge next to image
      const statusColors: Record<string, [number, number, number]> = {
        operational: [0, 255, 136],
        maintenance: [255, 204, 0],
        inactive: [255, 68, 68],
        reserve: [136, 153, 170],
      };
      const sc = statusColors[weapon.status] ?? ACCENT;
      const infoX = imgW + 15;
      const infoW = W - infoX - 10;

      // Classification pill
      setFill(pdf, [clsColor[0] * 0.1, clsColor[1] * 0.1, clsColor[2] * 0.1]);
      pdf.roundedRect(infoX, y + 2, infoW, 7, 1, 1, 'F');
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      setColor(pdf, clsColor);
      pdf.text(`⬛ ${cls}`, infoX + infoW / 2, y + 7, { align: 'center' });

      // Status
      pdf.setFontSize(8);
      setColor(pdf, sc);
      pdf.text(`● ${weapon.status.toUpperCase()}`, infoX, y + 17);

      // Category
      pdf.setFontSize(7);
      setColor(pdf, TEXT_MUTED);
      pdf.text('CATEGORY', infoX, y + 25);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      setColor(pdf, ACCENT);
      pdf.text(weapon.category.toUpperCase(), infoX, y + 32);

      // Country
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      setColor(pdf, TEXT_MUTED);
      pdf.text('COUNTRY', infoX, y + 40);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      setColor(pdf, TEXT_WHITE);
      pdf.text(weapon.country, infoX, y + 47);

      // Quantity
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      setColor(pdf, TEXT_MUTED);
      pdf.text('UNITS IN SERVICE', infoX, y + 55);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      setColor(pdf, sc);
      pdf.text(weapon.quantity.toLocaleString(), infoX, y + 63);

      y += imgH + 6;
    }
  }

  // ── Divider ──────────────────────────────────────────────────────────────────
  setDraw(pdf, [0, 50, 70]);
  pdf.setLineWidth(0.2);
  pdf.line(10, y, W - 10, y);
  y += 5;

  // ── Overview Info Grid ────────────────────────────────────────────────────────
  const infoItems = [
    ['LOCATION', weapon.locationName],
    ['LAST MAINTENANCE', weapon.lastMaintenance],
    ['NEXT MAINTENANCE', weapon.nextMaintenance],
    ['CLASSIFICATION', weapon.classification],
  ];
  const cellW = (W - 20) / 2;
  const cellH = 14;
  for (let i = 0; i < infoItems.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 10 + col * cellW;
    const cy = y + row * (cellH + 2);
    setFill(pdf, BG_PANEL);
    pdf.rect(cx, cy, cellW - 2, cellH, 'F');
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'normal');
    setColor(pdf, TEXT_MUTED);
    pdf.text(infoItems[i][0], cx + 3, cy + 5);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    setColor(pdf, TEXT_WHITE);
    const valText = pdf.splitTextToSize(infoItems[i][1], cellW - 8);
    pdf.text(valText[0] ?? '', cx + 3, cy + 11);
  }
  y += 2 * (cellH + 2) + 6;

  // ── Description ──────────────────────────────────────────────────────────────
  setFill(pdf, BG_PANEL);
  setDraw(pdf, [0, 50, 70]);
  pdf.setLineWidth(0.2);
  const descLines = pdf.splitTextToSize(weapon.description, W - 28);
  const descBoxH = 8 + descLines.length * 4.5;
  pdf.rect(10, y, W - 20, descBoxH, 'FD');
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'bold');
  setColor(pdf, ACCENT);
  pdf.text('SYSTEM OVERVIEW', 14, y + 6);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, TEXT_WHITE);
  pdf.text(descLines, 14, y + 12);
  y += descBoxH + 6;

  // ── Tech Specs ────────────────────────────────────────────────────────────────
  const specEntries = Object.entries(weapon.specs);
  if (specEntries.length > 0) {
    // Section header
    setFill(pdf, ACCENT);
    pdf.rect(10, y, W - 20, 8, 'F');
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(7, 11, 15);
    pdf.text('TECHNICAL SPECIFICATIONS', 14, y + 5.5);
    y += 8;

    // Spec rows
    const specColW = (W - 20) / 2;
    for (let i = 0; i < specEntries.length; i++) {
      const [key, val] = specEntries[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      if (col === 0) {
        // Check page overflow
        if (y + row * 8 + 8 > H - 20) break;
      }
      const sx = 10 + col * specColW;
      const sy = y + row * 8;
      const isEven = row % 2 === 0;
      setFill(pdf, isEven ? [10, 18, 26] : [14, 22, 30]);
      pdf.rect(sx, sy, specColW - 1, 8, 'F');
      // Accent left border
      setFill(pdf, [0, 40, 55]);
      pdf.rect(sx, sy, 1.5, 8, 'F');
      // Key
      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'normal');
      setColor(pdf, TEXT_MUTED);
      pdf.text(key, sx + 4, sy + 4.5);
      // Value
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      setColor(pdf, ACCENT);
      const valClipped = val.length > 30 ? val.slice(0, 28) + '..' : val;
      pdf.text(valClipped, sx + specColW - 3, sy + 5, { align: 'right' });
    }
    const rows = Math.ceil(specEntries.length / 2);
    y += rows * 8 + 6;
  }

  // ── Coordinates ──────────────────────────────────────────────────────────────
  if (weapon.location) {
    setFill(pdf, BG_PANEL);
    pdf.rect(10, y, W - 20, 12, 'F');
    pdf.setFontSize(6.5);
    pdf.setFont('helvetica', 'normal');
    setColor(pdf, TEXT_MUTED);
    pdf.text('GEOGRAPHIC COORDINATES', 14, y + 5);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    setColor(pdf, ACCENT);
    pdf.text(
      `${weapon.location[0].toFixed(4)}° N / ${weapon.location[1].toFixed(4)}° E  (${weapon.locationName})`,
      14, y + 10
    );
    y += 16;
  }

  // ── Classification Banner (Bottom) ───────────────────────────────────────────
  setFill(pdf, clsColor);
  pdf.rect(0, H - 10, W, 10, 'F');
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(7, 11, 15);
  pdf.text(`// ${cls} //  DATEWORLD WMS  ·  ${weapon.id}  ·  DO NOT DISTRIBUTE WITHOUT AUTHORIZATION //`,
    W / 2, H - 4.5, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────────────────────
  setFill(pdf, BG_DARK);
  pdf.rect(0, H - 18, W, 8, 'F');
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  setColor(pdf, TEXT_MUTED);
  pdf.text('DATEWORLD Weapon Management System  |  Authorized Personnel Only  |  Data sourced from OSINT public records', W / 2, H - 13, { align: 'center' });

  // ── Save ──────────────────────────────────────────────────────────────────────
  const fileName = `DATEWORLD_${weapon.id}_${weapon.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(fileName);
}
