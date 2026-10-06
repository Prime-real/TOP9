import { jsPDF } from 'jspdf';
import { NewsReport } from '../types/news';

export function generatePdfDocument(report: NewsReport) {
  // Create jsPDF in portrait A4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryNavy = '#0f2942';
  const crimsonRed = '#b91c1c';
  const textDark = '#1e293b';
  const textMuted = '#475569';
  const bgLight = '#f8fafc';
  const borderLight = '#e2e8f0';

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
      drawHeaderRunning();
    }
  }

  function drawHeaderRunning() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    doc.text('USA DAILY NEWS BRIEFING — INTELLIGENCE REPORT', margin, y);
    doc.text(report.reportDate, pageWidth - margin, y, { align: 'right' });
    y += 12;
    doc.setDrawColor(borderLight);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
  }

  // --- COVER / HEADER ---
  // US Flag bar accent (stripes)
  doc.setFillColor(185, 28, 28); // red
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 5;
  doc.setFillColor(15, 41, 66); // navy
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 18;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryNavy);
  doc.text('USA DAILY NEWS BRIEFING', margin, y);
  y += 16;

  // Subtitle & Meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(textMuted);
  doc.text(`Top 9 U.S. News Stories — ${report.reportDate}`, margin, y);
  
  // Right side meta
  const metaText = `Generated: ${report.generatedAt} | Verified: ${report.storiesVerified} Stories`;
  doc.setFontSize(9);
  doc.text(metaText, pageWidth - margin, y, { align: 'right' });
  y += 14;

  doc.setDrawColor(borderLight);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  // --- EXECUTIVE SUMMARY ("TODAY'S NEWS SNAPSHOT") ---
  doc.setFillColor(bgLight);
  doc.setDrawColor(borderLight);
  const snapshotTextLines = doc.splitTextToSize(report.executiveSummary, contentWidth - 24);
  const snapshotBoxHeight = snapshotTextLines.length * 13 + 32;

  checkPageBreak(snapshotBoxHeight);
  doc.roundedRect(margin, y, contentWidth, snapshotBoxHeight, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryNavy);
  doc.text("TODAY'S NEWS SNAPSHOT (EXECUTIVE SUMMARY)", margin + 12, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textDark);
  doc.text(snapshotTextLines, margin + 12, y + 32);
  y += snapshotBoxHeight + 16;

  // --- TABLE OF CONTENTS ---
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryNavy);
  doc.text('TABLE OF CONTENTS & INDEX', margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  report.tableOfContents.forEach((item) => {
    checkPageBreak(15);
    doc.setTextColor(crimsonRed);
    doc.text(`#${item.rank}`, margin + 5, y);
    doc.setTextColor(primaryNavy);
    doc.text(`[${item.category}]`, margin + 24, y);
    doc.setTextColor(textDark);
    const tocLine = doc.splitTextToSize(item.headline, contentWidth - 140)[0];
    doc.text(tocLine, margin + 125, y);
    y += 13;
  });
  y += 14;

  // --- 9 STORIES ---
  report.stories.forEach((story) => {
    checkPageBreak(180);

    // Separator line
    doc.setDrawColor(borderLight);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;

    // Rank badge & Category
    doc.setFillColor(15, 41, 66);
    doc.roundedRect(margin, y - 9, 24, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor('#ffffff');
    doc.text(`#${story.rank}`, margin + 6, y + 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(crimsonRed);
    doc.text(story.category.toUpperCase(), margin + 30, y + 2);

    // Location & Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    const locText = `${story.location} • ${story.date}`;
    doc.text(locText, pageWidth - margin, y + 2, { align: 'right' });
    y += 16;

    // Headline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryNavy);
    const headlineLines = doc.splitTextToSize(story.headline, contentWidth);
    doc.text(headlineLines, margin, y);
    y += headlineLines.length * 15 + 6;

    // Summary
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textDark);
    const summaryLines = doc.splitTextToSize(story.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 13 + 8;

    // Key Facts Box
    checkPageBreak(90);
    doc.setFillColor(bgLight);
    doc.setDrawColor(borderLight);
    
    // Calculate key facts height
    let kfHeight = 22;
    const bulletLinesArr = story.keyFacts.map(fact => doc.splitTextToSize(fact, contentWidth - 28));
    bulletLinesArr.forEach(lines => {
      kfHeight += lines.length * 11 + 4;
    });

    doc.roundedRect(margin, y, contentWidth, kfHeight, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy);
    doc.text('KEY FACTS:', margin + 10, y + 14);

    let kfY = y + 26;
    bulletLinesArr.forEach((lines) => {
      doc.setFillColor(15, 41, 66);
      doc.circle(margin + 12, kfY - 3, 1.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textDark);
      doc.text(lines, margin + 20, kfY);
      kfY += lines.length * 11 + 4;
    });
    y += kfHeight + 8;

    // Why it matters
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy);
    doc.text('Why It Matters: ', margin, y);
    const whyItMattersWidth = doc.getTextWidth('Why It Matters: ');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark);
    const wimLines = doc.splitTextToSize(story.whyItMatters, contentWidth - whyItMattersWidth);
    doc.text(wimLines, margin + whyItMattersWidth, y);
    y += wimLines.length * 12 + 6;

    // What happens next
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy);
    doc.text('What to Watch Next: ', margin, y);
    const wwnWidth = doc.getTextWidth('What to Watch Next: ');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark);
    const wwnLines = doc.splitTextToSize(story.whatHappensNext, contentWidth - wwnWidth);
    doc.text(wwnLines, margin + wwnWidth, y);
    y += wwnLines.length * 12 + 6;

    // Sources with clickable links & outlet badges in PDF
    if (story.sources && story.sources.length > 0) {
      checkPageBreak(20 + story.sources.length * 14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(primaryNavy);
      doc.text(`VERIFIED PRIMARY SOURCES (${story.sources.length} Independent Outlets):`, margin, y);
      y += 12;

      story.sources.forEach((source) => {
        checkPageBreak(14);
        const typeTag = source.outletType ? `[${source.outletType}] ` : '';
        const titleSnippet = source.articleTitle ? `"${source.articleTitle}" — ` : '';
        const fullSourceText = `${typeTag}${source.name} • ${titleSnippet}${source.date}`;
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(textDark);
        doc.text(typeTag, margin + 8, y);
        
        const typeWidth = doc.getTextWidth(typeTag);
        doc.setFont('helvetica', 'normal');
        doc.text(`${source.name} • ${titleSnippet}${source.date}`, margin + 8 + typeWidth, y);

        const domainText = source.channelOrDomain || source.url;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 102, 204);
        doc.text(`[Link: ${domainText}]`, pageWidth - margin, y, { align: 'right' });
        if (source.url) {
          const domainWidth = doc.getTextWidth(`[Link: ${domainText}]`);
          doc.link(pageWidth - margin - domainWidth, y - 7, domainWidth, 9, { url: source.url });
        }
        y += 11;
      });
      y += 6;
    }
  });

  // --- KEY DEVELOPMENTS TO WATCH SECTION ---
  checkPageBreak(120);
  doc.setDrawColor(primaryNavy);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryNavy);
  doc.text('KEY DEVELOPMENTS TO WATCH ACROSS THE UNITED STATES', margin, y);
  y += 14;

  report.keyDevelopmentsToWatch.forEach((dev) => {
    checkPageBreak(30);
    doc.setFillColor(185, 28, 28);
    doc.circle(margin + 5, y - 3, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textDark);
    const devLines = doc.splitTextToSize(dev, contentWidth - 18);
    doc.text(devLines, margin + 14, y);
    y += devLines.length * 12 + 6;
  });
  y += 14;

  // --- EDITORIAL DISCLAIMER ---
  checkPageBreak(60);
  doc.setFillColor(bgLight);
  doc.setDrawColor(borderLight);
  const discLines = doc.splitTextToSize(report.disclaimer, contentWidth - 16);
  const discHeight = discLines.length * 10 + 16;
  doc.roundedRect(margin, y, contentWidth, discHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  doc.text(discLines, margin + 8, y + 12);
  y += discHeight + 10;

  // --- NUMBER ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textMuted);
    doc.text(
      `Page ${i} of ${totalPages}  •  USA DAILY NEWS BRIEFING`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  // Save the generated PDF
  const cleanDate = report.reportDate.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`USA_Daily_News_Briefing_${cleanDate}.pdf`);
}

export function generateSummaryPdfDocument(report: NewsReport) {
  // Create jsPDF in portrait A4 for 1-page executive summary
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryNavy = '#0f2942';
  const crimsonRed = '#b91c1c';
  const textDark = '#1e293b';
  const textMuted = '#475569';
  const bgLight = '#f8fafc';
  const borderLight = '#e2e8f0';

  // --- HEADER ACCENT BARS ---
  doc.setFillColor(185, 28, 28); // red
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 5;
  doc.setFillColor(15, 41, 66); // navy
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 16;

  // Title & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryNavy);
  doc.text('USA DAILY NEWS BRIEFING', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(crimsonRed);
  doc.text('EXECUTIVE INTELLIGENCE SUMMARY', pageWidth - margin, y, { align: 'right' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(textMuted);
  doc.text(`Daily National Briefing — ${report.reportDate}`, margin, y);
  doc.text(`Generated: ${report.generatedAt} | 9 Verified Stories`, pageWidth - margin, y, { align: 'right' });
  y += 12;

  doc.setDrawColor(borderLight);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;

  // --- EXECUTIVE SUMMARY BOX ---
  doc.setFillColor(bgLight);
  doc.setDrawColor(borderLight);
  const snapshotTextLines = doc.splitTextToSize(report.executiveSummary, contentWidth - 20);
  const snapshotBoxHeight = snapshotTextLines.length * 11 + 24;

  doc.roundedRect(margin, y, contentWidth, snapshotBoxHeight, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryNavy);
  doc.text("TODAY'S EXECUTIVE SNAPSHOT", margin + 10, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark);
  doc.text(snapshotTextLines, margin + 10, y + 26);
  y += snapshotBoxHeight + 14;

  // --- TOP 9 HIGHLIGHTS INDEX ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy);
  doc.text('TOP 9 VERIFIED NATIONAL STORIES (RANKED)', margin, y);
  y += 12;

  report.stories.forEach((story) => {
    // Rank badge
    doc.setFillColor(15, 41, 66);
    doc.roundedRect(margin, y - 8, 18, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor('#ffffff');
    doc.text(`#${story.rank}`, margin + 3.5, y + 1);

    // Category
    doc.setTextColor(crimsonRed);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const catStr = `[${story.category}]`;
    doc.text(catStr, margin + 23, y);
    const catWidth = doc.getTextWidth(catStr);

    // Headline
    doc.setTextColor(textDark);
    doc.setFont('helvetica', 'bold');
    const availableWidth = contentWidth - 30 - catWidth - 80;
    const headlineSnippet = doc.splitTextToSize(story.headline, availableWidth)[0];
    doc.text(headlineSnippet, margin + 28 + catWidth, y);

    // Primary Source
    const firstSrc = story.sources[0]?.name || 'Verified Source';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted);
    doc.text(`${firstSrc}`, pageWidth - margin, y, { align: 'right' });

    y += 12;

    // 1-line key fact
    if (story.keyFacts[0]) {
      doc.setTextColor(textMuted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const factLine = doc.splitTextToSize(`• ${story.keyFacts[0]}`, contentWidth - 30)[0];
      doc.text(factLine, margin + 24, y);
      y += 10;
    }
    y += 2;
  });

  y += 8;

  // --- KEY DEVELOPMENTS TO WATCH ---
  doc.setDrawColor(borderLight);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryNavy);
  doc.text('KEY DEVELOPMENTS TO WATCH IN THE COMING DAYS', margin, y);
  y += 12;

  report.keyDevelopmentsToWatch.slice(0, 3).forEach((dev) => {
    doc.setFillColor(185, 28, 28);
    doc.circle(margin + 4, y - 2.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textDark);
    const devSnippet = doc.splitTextToSize(dev, contentWidth - 14)[0];
    doc.text(devSnippet, margin + 10, y);
    y += 11;
  });

  y += 8;

  // --- DISCLAIMER & FOOTER ---
  doc.setFillColor(bgLight);
  doc.setDrawColor(borderLight);
  const discLines = doc.splitTextToSize(report.disclaimer, contentWidth - 16);
  const discHeight = discLines.length * 7 + 10;
  doc.roundedRect(margin, y, contentWidth, discHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted);
  doc.text(discLines, margin + 8, y + 8);
  y += discHeight + 8;

  // Page Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted);
  doc.text(
    `Page 1 of 1 • USA DAILY NEWS BRIEFING (EXECUTIVE SUMMARY) • ${report.reportDate}`,
    pageWidth / 2,
    pageHeight - 16,
    { align: 'center' }
  );

  const cleanDate = report.reportDate.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`USA_News_Executive_Summary_${cleanDate}.pdf`);
}

