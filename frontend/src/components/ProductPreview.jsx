import React, { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import JsBarcode from 'jsbarcode';

function ProductPreview({ product1 }) {
  const barcodeRef = useRef(null);
  const uniqueId = product1.uniqueid;
  const generatePDF = () => {
    const widthInMM = 60; // 60mm width
    const lengthInMM = 40; // 40mm length
    const widthInPoints = widthInMM * (72 / 25.4); // Convert mm to points
    const lengthInPoints = lengthInMM * (72 / 25.4); // Convert mm to points
  
    const doc = new jsPDF({ unit: 'pt', format: [widthInPoints, lengthInPoints] });
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Other bill details
    doc.setFontSize(10); // Adjusted font size for readability
    doc.text(`Product Name: ${product1.name}`, 10, 20);
    doc.text(`Brand: ${product1.brand || 'N/A'}`, 10, 40);
    doc.text(`Color: ${product1.color || 'N/A'}`, 10, 60);
    doc.text(`Size: ${product1.size || 'N/A'}`, 10, 80);
  
    // Set font size for the total amount
    doc.setFontSize(10); // Adjust font size for readability
  
    // Calculate the total amount text
    const totalAmountText = `Price: Rs. ${product1.price || 0}`;
  
    // Get the width of the total amount text
    const totalAmountWidth = doc.getTextWidth(totalAmountText);
  
    // Calculate the X position to center the text
    const xPosition = (pageWidth - totalAmountWidth) / 2;
  
    // Set the Y position for the text
    const yPosition = 100; // Adjusted Y position
  
    // Add the text to the PDF
    doc.text(totalAmountText, xPosition, yPosition);
  
    // Barcode
    if (barcodeRef.current) {
      const barcodeSvg = barcodeRef.current;
      const svgString = new XMLSerializer().serializeToString(barcodeSvg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const barcodeImgData = canvas.toDataURL("image/png");
  
        // Positioning the barcode
        const barcodeX = 10; // X position of the barcode
        const barcodeY = yPosition + 20; // Y position below the total amount text
  
        // Increase the size of the barcode
        const barcodeWidth = 60; // Increase width
        const barcodeHeight = 30; // Increase height
  
        doc.addImage(barcodeImgData, 'PNG', barcodeX, barcodeY, barcodeWidth, barcodeHeight);
  
        // Add the heading below the barcode
        doc.setFontSize(12);
        const headingText = 'SG Store';
        const headingWidth = doc.getTextWidth(headingText);
        const headingX = (pageWidth - headingWidth) / 2;
        const headingY = barcodeY + barcodeHeight + 10; // Move heading down from the barcode
  
        doc.text(headingText, headingX, headingY);
  
        // Save the PDF
        doc.save('bill.pdf');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    }
  };
  

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, uniqueId, {
        format: "CODE128",
        lineColor: "#000",
        width: 0.3,
        height: 5,
        displayValue: false
      });
    }
  }, [uniqueId]);

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-white shadow-lg rounded-lg mt-6">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold mb-2">Product Preview</h2>
        <p className="text-gray-700"><strong>Customer Name:</strong> {product1.name}</p>
        <p className="text-gray-700"><strong>Brand:</strong> {product1.brand || 'N/A'}</p>
        <p className="text-gray-700"><strong>Phone Number:</strong> {product1.color || 'N/A'}</p>
        <p className="text-gray-700"><strong>Transaction ID:</strong> {product1._id}</p>
        <p className="text-gray-700"><strong>Created At:</strong> {new Date(product1.createdAt).toLocaleString()}</p>
        <p className="text-gray-700"><strong>Total Amount:</strong> Rs. {product1.price || 0}</p>
        <div>
          <svg ref={barcodeRef}></svg>
        </div>
      </div>
      <div className="mb-4">
        {/* Additional details or table if necessary */}
      </div>
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download PDF
      </button>
    </div>
  );
}

export default ProductPreview;
