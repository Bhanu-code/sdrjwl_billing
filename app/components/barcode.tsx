import React from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  format?: "EAN13" | "CODE128" | "UPC" | string;
  className?: string;
  showImage?: boolean; // New prop to control SVG or image rendering
}

const Barcode: React.FC<BarcodeProps> = ({ 
  value, 
  width = 2, 
  height = 100, 
  displayValue = true,
  format = "EAN13",
  className = "",
  showImage = false // Default to SVG
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!value) return;

    try {
      if (showImage && canvasRef.current) {
        // Create canvas-based barcode
        const canvas = canvasRef.current;
        JsBarcode(canvas, value, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue
        });
      } else if (svgRef.current) {
        // Create SVG barcode
        JsBarcode(svgRef.current, value, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue
        });
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }, [value, width, height, format, displayValue, showImage]);

  if (showImage) {
    return <canvas ref={canvasRef} className={className} />;
  }

  return <svg ref={svgRef} className={className}></svg>;
};

export default Barcode;