const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const QRCode = require("qrcode");

const generateRequestPDF = async (
  request,
  equipmentTypes,
  createdByUser,
  fulfilledByUser,
  depotSite,
  boxNumber,
  bayNumber,
  fulfillmentDate,
) => {
  const uploadsDir = path.resolve(__dirname, "../uploads/pdfs");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `request-${request.requestNumber}.pdf`;
  const filePath = path.join(uploadsDir, filename);

  const qrDataUrl = await QRCode.toDataURL(request.requestNumber, {
    width: 120,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [595, 842],
      margins: { top: 20, bottom: 25, left: 18, right: 18 },
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const lm = 18;
    const cw = 595 - lm - 18;

    doc.rect(0, 0, 595, 3).fill("#000000");

    doc.y = 22;
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#000000");
    doc.text("EQUIPIT", lm, doc.y, { align: "center", width: cw });

    doc.fontSize(10).font("Helvetica").fillColor("#555555");
    doc.text("Warehouse Equipment Management", lm, doc.y + 20, {
      align: "center",
      width: cw,
    });

    doc.fontSize(15).font("Helvetica-Bold").fillColor("#000000");
    doc.text("DISPATCH ADVICE NOTE", lm, doc.y + 42, {
      align: "center",
      width: cw,
    });

    doc.moveDown(4.5);

    doc
      .moveTo(lm, doc.y)
      .lineTo(lm + cw, doc.y)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.moveDown(0.8);

    const gap = 10;
    const boxW = (cw - gap) / 2;
    const boxY = doc.y;
    const boxH = 135;

    doc
      .rect(lm, boxY, boxW, boxH)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.rect(lm, boxY, boxW, 16).fill("#000000");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("REQUEST DETAILS", lm, boxY + 4, { align: "center", width: boxW });

    const leftItems = [
      [
        { label: "Request No.", value: request.requestNumber },
        { label: "Status", value: "Fulfilled" },
      ],
      [
        { label: "Supplier", value: request.supplier || "N/A" },
        {
          label: "Template",
          value: request.template ? request.template.name : "N/A",
        },
      ],
      [
        { label: "Depot Site", value: depotSite ? depotSite.name : "N/A" },
        { label: "", value: "" },
      ],
    ];

    const halfW = (boxW - 20) / 2;

    leftItems.forEach((row, i) => {
      const y = boxY + 20 + i * 36;
      row.forEach((item, j) => {
        const colX = lm + 8 + j * (halfW + 4);
        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#888888")
          .text(item.label, colX, y, { width: halfW });
        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .fillColor("#000000")
          .text(item.value, colX, y + 11, { width: halfW });
      });
    });

    const rightX = lm + boxW + gap;
    doc
      .rect(rightX, boxY, boxW, boxH)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.rect(rightX, boxY, boxW, 16).fill("#000000");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("FULFILLMENT DETAILS", rightX, boxY + 4, {
      align: "center",
      width: boxW,
    });

    const rightItems = [
      [
        {
          label: "Created By",
          value: createdByUser ? createdByUser.name : "Unknown",
        },
        {
          label: "Date Planned",
          value: request.plannedDate
            ? new Date(request.plannedDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "N/A",
        },
      ],
      [
        {
          label: "Fulfilled By",
          value: fulfilledByUser ? fulfilledByUser.name : "Unknown",
        },
        {
          label: "Fulfillment Date",
          value: fulfillmentDate
            ? new Date(fulfillmentDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "N/A",
        },
      ],
      [
        { label: "Box Number", value: boxNumber || "N/A" },
        { label: "Bay Number", value: bayNumber || "N/A" },
      ],
    ];

    rightItems.forEach((row, i) => {
      const y = boxY + 20 + i * 36;
      row.forEach((item, j) => {
        const colX = rightX + 8 + j * (halfW + 4);
        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#888888")
          .text(item.label, colX, y, { width: halfW });
        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .fillColor("#000000")
          .text(item.value, colX, y + 11, { width: halfW });
      });
    });

    doc.y = boxY + boxH + 16;

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000");
    doc.text("EQUIPMENT ALLOCATION", lm, doc.y, { align: "center", width: cw });
    doc.moveDown(0.6);

    const tblTop = doc.y;
    const tblLeft = lm;
    const tblW = cw;
    const colNoX = tblLeft + 10;
    const colTypeX = tblLeft + 42;
    const colQtyX = tblLeft + tblW - 65;

    doc.rect(tblLeft, tblTop, tblW, 20).fill("#000000");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("#", colNoX, tblTop + 5, { width: 25 });
    doc.text("Equipment Type", colTypeX, tblTop + 5, {
      width: colQtyX - colTypeX - 5,
    });
    doc.text("Qty", colQtyX, tblTop + 5, { width: 55, align: "center" });

    doc.y = tblTop + 20;

    if (request.equipments && request.equipments.length > 0) {
      request.equipments.forEach((eq, i) => {
        const eqName = eq.equipmentType ? eq.equipmentType.name : "Unknown";
        const rowY = doc.y;
        const bgColor = i % 2 === 0 ? "#f0f0f0" : "#ffffff";

        doc.rect(tblLeft, rowY, tblW, 21).fill(bgColor);
        doc.fontSize(8).font("Helvetica").fillColor("#000000");
        doc.text((i + 1).toString(), colNoX, rowY + 5, { width: 25 });
        doc.text(eqName, colTypeX, rowY + 5, { width: colQtyX - colTypeX - 5 });
        doc.text(eq.quantity.toString(), colQtyX, rowY + 5, {
          width: 55,
          align: "center",
        });
        doc.y = rowY + 21;
      });
    } else {
      const rowY = doc.y;
      doc.rect(tblLeft, rowY, tblW, 21).fill("#ffffff");
      doc.fontSize(8).font("Helvetica").fillColor("#888888");
      doc.text("No equipment allocated", tblLeft, rowY + 5, {
        width: tblW,
        align: "center",
      });
      doc.y = rowY + 21;
    }

    doc
      .moveTo(tblLeft, doc.y)
      .lineTo(tblLeft + tblW, doc.y)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.moveDown(1.2);

    const authSectionY = doc.y;
    const authBoxH = 110;

    const authW = cw * 0.55;
    doc
      .rect(lm, authSectionY, authW, authBoxH)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.rect(lm, authSectionY, authW, 16).fill("#000000");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("AUTHORISATION", lm, authSectionY + 4, {
      align: "center",
      width: authW,
    });

    if (fulfilledByUser) {
      doc.fontSize(9).font("Helvetica").fillColor("#888888");
      doc.text("Authorised by:", lm + 10, authSectionY + 26);
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000");
      doc.text("Manager", lm + 10, authSectionY + 38);
    }

    doc
      .moveTo(lm + 10, authSectionY + 78)
      .lineTo(lm + authW - 10, authSectionY + 78)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.fontSize(9).font("Helvetica").fillColor("#888888");
    doc.text("Authorised Signature", lm + 10, authSectionY + 82, {
      width: authW - 20,
    });

    const qrW = cw * 0.45 - gap;
    const qrBoxX = lm + authW + gap;
    doc
      .rect(qrBoxX, authSectionY, qrW, authBoxH)
      .lineWidth(0.5)
      .strokeColor("#000000")
      .stroke();
    doc.rect(qrBoxX, authSectionY, qrW, 16).fill("#000000");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("SCAN TO DISPATCH", qrBoxX, authSectionY + 4, {
      align: "center",
      width: qrW,
    });

    const qrSize = 60;
    const qrX = qrBoxX + qrW / 2 - qrSize / 2;
    const qrY = authSectionY + 22;
    doc.image(qrDataUrl, qrX, qrY, { width: qrSize, height: qrSize });

    doc.fontSize(11).font("Helvetica-Bold").fillColor("#000000");
    doc.text(request.requestNumber, qrBoxX, qrY + qrSize + 10, {
      width: qrW,
      align: "center",
    });

    doc.y = authSectionY + authBoxH + 14;

    doc.fontSize(7).font("Helvetica").fillColor("#999999");
    doc.text(
      `Generated by Equipit on ${new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} — This is a computer-generated document.`,
      lm,
      doc.page.height - 45,
      { align: "center" },
    );

    doc.rect(0, doc.page.height - 3, 595, 3).fill("#000000");

    doc.end();

    stream.on("finish", () => resolve({ filename, filePath }));
    stream.on("error", reject);
  });
};

module.exports = { generateRequestPDF };
