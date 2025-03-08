import React from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  format?: string;
  className?: string;
}

const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 2,
  height = 100,
  displayValue = true,
  format = "CODE128", // Use CODE128 for broader compatibility
  className = "",
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!value || !svgRef.current) return;

    try {
      // Clear the SVG content before generating a new barcode
      svgRef.current.innerHTML = '';
      JsBarcode(svgRef.current, value, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }, [value, width, height, format, displayValue]);

  return <svg ref={svgRef} className={className} />;
};

export default Barcode;