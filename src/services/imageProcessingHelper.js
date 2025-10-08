// Canvas and SVG graphics components for interactive visualizations

import React, { useRef, useEffect, useState, useCallback } from 'react';

// Interactive Van Layout Diagram using Canvas
export function VanLayoutCanvas({ van, selectedAmenities = [], onAmenityClick }) {
  const canvasRef = useRef(null);
  const [hoveredAmenity, setHoveredAmenity] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Van layout coordinates and amenities mapping
  const amenityCoordinates = {
    'Kitchen': { x: 50, y: 100, width: 120, height: 80, color: '#10B981' },
    'Shower': { x: 200, y: 120, width: 80, height: 60, color: '#3B82F6' },
    'Toilet': { x: 200, y: 200, width: 80, height: 60, color: '#6366F1' },
    'Bed': { x: 320, y: 80, width: 200, height: 120, color: '#8B5CF6' },
    'Fridge': { x: 50, y: 200, width: 60, height: 80, color: '#06B6D4' },
    'Storage': { x: 520, y: 200, width: 60, height: 100, color: '#84CC16' },
    'Seating': { x: 50, y: 300, width: 150, height: 80, color: '#F59E0B' },
    'Table': { x: 220, y: 320, width: 100, height: 60, color: '#EF4444' },
    'Air Conditioning': { x: 450, y: 50, width: 100, height: 30, color: '#14B8A6' },
    'Solar Panel': { x: 200, y: 20, width: 200, height: 40, color: '#F97316' }
  };

  const drawVanLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw van outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#F9FAFB';
    ctx.fillRect(10, 10, width - 20, height - 20);
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Draw van front (driver cabin)
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(10, 10, width - 20, 50);
    ctx.strokeRect(10, 10, width - 20, 50);

    // Draw door outline
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.strokeRect(width - 30, 150, 20, 100);

    // Draw amenities that exist in the van
    if (van && van.features) {
      van.features.forEach(feature => {
        const coords = amenityCoordinates[feature];
        if (coords) {
          // Determine amenity state
          const isSelected = selectedAmenities.includes(feature);
          const isHovered = hoveredAmenity === feature;
          
          // Set colors based on state
          let fillColor = coords.color;
          let strokeColor = coords.color;
          
          if (isSelected) {
            fillColor = coords.color;
            strokeColor = '#1F2937';
            ctx.lineWidth = 3;
          } else if (isHovered) {
            fillColor = coords.color + '80'; // Add transparency
            strokeColor = coords.color;
            ctx.lineWidth = 2;
          } else {
            fillColor = coords.color + '40'; // Light transparency
            strokeColor = coords.color;
            ctx.lineWidth = 1;
          }

          // Draw amenity rectangle
          ctx.fillStyle = fillColor;
          ctx.strokeStyle = strokeColor;
          ctx.fillRect(coords.x, coords.y, coords.width, coords.height);
          ctx.strokeRect(coords.x, coords.y, coords.width, coords.height);

          // Draw amenity label
          ctx.fillStyle = '#1F2937';
          ctx.font = '12px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const textX = coords.x + coords.width / 2;
          const textY = coords.y + coords.height / 2;
          
          // Add background for text readability
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          const textWidth = ctx.measureText(feature).width;
          ctx.fillRect(textX - textWidth/2 - 4, textY - 8, textWidth + 8, 16);
          
          // Draw text
          ctx.fillStyle = '#1F2937';
          ctx.fillText(feature, textX, textY);
        }
      });
    }

    // Draw scale indicator
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${van?.dimensions?.length || 6}m length`, 20, height - 20);
    ctx.fillText(`${van?.dimensions?.width || 2}m width`, 120, height - 20);
  }, [van, selectedAmenities, hoveredAmenity, canvasSize]);

  // Handle canvas clicks
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !van?.features) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check which amenity was clicked
    for (const feature of van.features) {
      const coords = amenityCoordinates[feature];
      if (coords && 
          x >= coords.x && x <= coords.x + coords.width &&
          y >= coords.y && y <= coords.y + coords.height) {
        onAmenityClick && onAmenityClick(feature);
        break;
      }
    }
  };

  // Handle mouse movement for hover effects
  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !van?.features) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let newHovered = null;
    for (const feature of van.features) {
      const coords = amenityCoordinates[feature];
      if (coords && 
          x >= coords.x && x <= coords.x + coords.width &&
          y >= coords.y && y <= coords.y + coords.height) {
        newHovered = feature;
        break;
      }
    }

    if (newHovered !== hoveredAmenity) {
      setHoveredAmenity(newHovered);
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const newWidth = Math.min(containerWidth - 20, 800);
        const newHeight = Math.round(newWidth * 0.6); // Maintain aspect ratio
        setCanvasSize({ width: newWidth, height: newHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawVanLayout();
  }, [drawVanLayout]);

  // Set canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      drawVanLayout();
    }
  }, [canvasSize, drawVanLayout]);

  return (
    <div className="van-layout-container">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Interactive Van Layout</h3>
        <p className="text-sm text-gray-600">
          Click on amenities to highlight them. Hover to see details.
        </p>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredAmenity(null)}
          className="cursor-pointer border border-gray-100 rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {hoveredAmenity && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <strong>{hoveredAmenity}</strong> - Click to highlight this feature
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {van?.features?.map(feature => {
          const coords = amenityCoordinates[feature];
          if (!coords) return null;
          
          return (
            <div
              key={feature}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                selectedAmenities.includes(feature) 
                  ? 'bg-blue-100 border border-blue-300' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onAmenityClick && onAmenityClick(feature)}
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: coords.color }}
              />
              <span className="text-sm">{feature}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Dynamic Pricing Chart using Canvas
export function PricingChart({ priceData, selectedDateRange }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 300 });

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !priceData) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvasSize;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, width, height);

    // Find price range
    const prices = priceData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (price levels)
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Price labels
      const priceLevel = maxPrice - (priceRange * i) / 5;
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`$${Math.round(priceLevel)}`, padding - 10, y);
    }

    // Vertical grid lines (dates)
    const dateStep = Math.max(1, Math.floor(priceData.length / 6));
    for (let i = 0; i < priceData.length; i += dateStep) {
      const x = padding + (chartWidth * i) / (priceData.length - 1);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // Date labels
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const date = new Date(priceData[i].date);
      ctx.fillText(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        x, height - padding + 10
      );
    }

    // Draw price line
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    priceData.forEach((dataPoint, index) => {
      const x = padding + (chartWidth * index) / (priceData.length - 1);
      const y = padding + ((maxPrice - dataPoint.price) / priceRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw price points
    priceData.forEach((dataPoint, index) => {
      const x = padding + (chartWidth * index) / (priceData.length - 1);
      const y = padding + ((maxPrice - dataPoint.price) / priceRange) * chartHeight;
      
      // Check if this point is in selected range
      const isInRange = selectedDateRange && 
        new Date(dataPoint.date) >= new Date(selectedDateRange.start) &&
        new Date(dataPoint.date) <= new Date(selectedDateRange.end);

      ctx.fillStyle = isInRange ? '#EF4444' : '#3B82F6';
      ctx.beginPath();
      ctx.arc(x, y, isInRange ? 6 : 4, 0, 2 * Math.PI);
      ctx.fill();

      // Show price on hover (simplified)
      if (isInRange) {
        ctx.fillStyle = '#1F2937';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`$${dataPoint.price}`, x, y - 10);
      }
    });

    // Draw selected range highlight
    if (selectedDateRange) {
      const startIndex = priceData.findIndex(d => 
        new Date(d.date) >= new Date(selectedDateRange.start));
      const endIndex = priceData.findLastIndex(d => 
        new Date(d.date) <= new Date(selectedDateRange.end));

      if (startIndex >= 0 && endIndex >= 0) {
        const startX = padding + (chartWidth * startIndex) / (priceData.length - 1);
        const endX = padding + (chartWidth * endIndex) / (priceData.length - 1);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(startX, padding, endX - startX, chartHeight);
      }
    }

    // Chart title
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Price Trends', width / 2, 10);

    // Y-axis label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Price per Night ($)', 0, 0);
    ctx.restore();

  }, [priceData, selectedDateRange, canvasSize]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const newWidth = Math.min(containerWidth - 20, 800);
        const newHeight = Math.round(newWidth * 0.4);
        setCanvasSize({ width: newWidth, height: newHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw when dependencies change
  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // Set canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      drawChart();
    }
  }, [canvasSize, drawChart]);

  return (
    <div className="pricing-chart-container">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

// SVG Availability Calendar
export function AvailabilityCalendar({ availability, onDateSelect, selectedRange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getDateStatus = (date) => {
    if (!date) return 'empty';
    
    const dateStr = date.toISOString().split('T')[0];
    const availabilityEntry = availability?.find(a => a.date === dateStr);
    
    if (selectedRange?.start && selectedRange?.end) {
      if (date >= selectedRange.start && date <= selectedRange.end) {
        return 'selected';
      }
    } else if (selectedRange?.start && date.toDateString() === selectedRange.start.toDateString()) {
      return 'selected';
    }
    
    if (availabilityEntry) {
      return availabilityEntry.available ? 'available' : 'booked';
    }
    
    return 'available'; // Default to available if no data
  };

  const handleDateClick = (date) => {
    if (!date || date < new Date()) return;
    onDateSelect && onDateSelect(date);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const cellSize = 35;
  const calendarWidth = cellSize * 7;
  const calendarHeight = Math.ceil(days.length / 7) * cellSize + 100; // Extra space for header

  return (
    <div className="availability-calendar">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <svg width={calendarWidth} height={calendarHeight} className="border border-gray-200 rounded">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <g key={day}>
            <rect
              x={index * cellSize}
              y={0}
              width={cellSize}
              height={cellSize}
              fill="#F3F4F6"
              stroke="#D1D5DB"
            />
            <text
              x={index * cellSize + cellSize / 2}
              y={cellSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="600"
              fill="#374151"
            >
              {day}
            </text>
          </g>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const x = col * cellSize;
          const y = (row + 1) * cellSize; // +1 for header row
          const status = getDateStatus(date);

          let fillColor = '#FFFFFF';
          let strokeColor = '#D1D5DB';
          let textColor = '#374151';
          let cursor = 'pointer';

          switch (status) {
            case 'empty':
              fillColor = '#F9FAFB';
              cursor = 'default';
              break;
            case 'available':
              fillColor = '#ECFDF5';
              strokeColor = '#10B981';
              break;
            case 'booked':
              fillColor = '#FEF2F2';
              strokeColor = '#EF4444';
              textColor = '#DC2626';
              cursor = 'not-allowed';
              break;
            case 'selected':
              fillColor = '#DBEAFE';
              strokeColor = '#3B82F6';
              textColor = '#1D4ED8';
              break;
          }

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={status === 'selected' ? 2 : 1}
                style={{ cursor }}
                onClick={() => handleDateClick(date)}
              />
              {date && (
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fill={textColor}
                  fontWeight={status === 'selected' ? '600' : '400'}
                  style={{ cursor }}
                  onClick={() => handleDateClick(date)}
                >
                  {date.getDate()}
                </text>
              )}
              
              {/* Status indicator dot */}
              {date && status !== 'empty' && (
                <circle
                  cx={x + cellSize - 8}
                  cy={y + 8}
                  r={3}
                  fill={
                    status === 'available' ? '#10B981' :
                    status === 'booked' ? '#EF4444' :
                    status === 'selected' ? '#3B82F6' : '#9CA3AF'
                  }
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

// Digital Signature Capture using Canvas
export function SignatureCanvas({ onSignatureChange, width = 400, height = 200 }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    if (hasSignature) {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL('image/png');
      onSignatureChange && onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#E5E7EB';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    setHasSignature(false);
    onSignatureChange && onSignatureChange(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      
      // Set up canvas background
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(0, 0, width, height);
      
      // Add placeholder text
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Sign here', width / 2, height / 2);
    }
  }, [width, height]);

  return (
    <div className="signature-canvas-container">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Digital Signature *
        </label>
        <p className="text-xs text-gray-500">
          Please sign in the box below to confirm your agreement
        </p>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvasRef.current.dispatchEvent(mouseEvent);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            canvasRef.current.dispatchEvent(mouseEvent);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvasRef.current.dispatchEvent(mouseEvent);
          }}
          className="border border-gray-300 rounded cursor-crosshair touch-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
        >
          Clear
        </button>
      </div>
      
      {!hasSignature && (
        <p className="mt-1 text-xs text-red-600">
          Signature is required to complete the booking
        </p>
      )}
    </div>
  );
}

// Custom SVG Icons
export function VanIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 12h2l3-9h8l3 9h2c1.1 0 2 .9 2 2v3c0 .55-.45 1-1 1h-1c0 1.1-.9 2-2 2s-2-.9-2-2H9c0 1.1-.9 2-2 2s-2-.9-2-2H4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2z"
        className="fill-current"
      />
      <circle cx="7" cy="17" r="1" className="fill-current"/>
      <circle cx="17" cy="17" r="1" className="fill-current"/>
    </svg>
  );
}

export function LocationIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  );
}

export function CalendarIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}
