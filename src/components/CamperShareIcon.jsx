// CamperShare Icon Component - Elegant rounded design
export function CamperShareIcon({ className = "h-8 w-8", ...props }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      {...props}
    >
      {/* Outer circle with gradient */}
      <defs>
        <linearGradient id="campershare-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* Main circle background - lighter like reference */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        fill="#a7f3d0"
        filter="url(#shadow)"
      />
      
      {/* Inner circle for depth */}
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="none"
        stroke="rgba(20,184,166,0.1)"
        strokeWidth="0.5"
      />
      
      {/* Clean Motorhome Silhouette - based on reference design */}
      <g transform="translate(50,50)">
        {/* Main motorhome body - clean and simple */}
        <path 
          d="M-20 -8 L-20 6 L-14 6 L-14 8 L-10 8 L-10 6 L10 6 L10 8 L14 8 L14 6 L20 6 L20 -2 Q20 -8 14 -8 L8 -8 L8 -12 Q8 -16 4 -16 L-16 -16 Q-20 -16 -20 -12 Z" 
          fill="white"
        />
        
        {/* Driver cabin window */}
        <path 
          d="M-18 -12 Q-18 -14 -16 -14 L2 -14 Q4 -14 4 -12 L4 -10 L-18 -10 Z" 
          fill="#14b8a6" 
          opacity="0.4"
        />
        
        {/* Side window - large and rectangular like reference */}
        <rect 
          x="-14" 
          y="-6" 
          width="12" 
          height="6" 
          rx="1" 
          fill="#14b8a6" 
          opacity="0.4"
        />
        
        {/* Front wheels */}
        <circle 
          cx="-12" 
          cy="10" 
          r="4" 
          fill="white"
          stroke="#14b8a6"
          strokeWidth="1"
        />
        <circle 
          cx="-12" 
          cy="10" 
          r="2" 
          fill="#14b8a6"
        />
        
        {/* Rear wheels */}
        <circle 
          cx="12" 
          cy="10" 
          r="4" 
          fill="white"
          stroke="#14b8a6"
          strokeWidth="1"
        />
        <circle 
          cx="12" 
          cy="10" 
          r="2" 
          fill="#14b8a6"
        />
        
        {/* Ground shadow/base - like in reference */}
        <ellipse 
          cx="0" 
          cy="14" 
          rx="25" 
          ry="3" 
          fill="#14b8a6" 
          opacity="0.2"
        />
      </g>
    </svg>
  )
}

// Alternative kompakte Version für kleinere Größen
export function CamperShareIconCompact({ className = "h-6 w-6", ...props }) {
  return <CamperShareIcon className={className} {...props} />
}

// Alternative Größen für verschiedene Verwendungszwecke
export function CamperShareIconLarge({ className = "h-16 w-16", ...props }) {
  return <CamperShareIcon className={className} {...props} />
}

export function CamperShareIconSmall({ className = "h-4 w-4", ...props }) {
  return <CamperShareIcon className={className} {...props} />
}

// Icon für Branding (größere Größen)
export function CamperShareBrandIcon({ className = "h-20 w-20", ...props }) {
  return <CamperShareIcon className={className} {...props} />
}
