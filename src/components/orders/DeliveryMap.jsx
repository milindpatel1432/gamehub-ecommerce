import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function DeliveryMap({ warehouse, customer, truck, className = 'h-80 w-full' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const warehouseLat = warehouse?.lat || 19.0760;
    const warehouseLng = warehouse?.lng || 72.8777;
    const customerLat = customer?.lat || 19.1136;
    const customerLng = customer?.lng || 72.8697;
    const truckLat = truck?.lat || (warehouseLat + (customerLat - warehouseLat) * 0.6);
    const truckLng = truck?.lng || (warehouseLng + (customerLng - warehouseLng) * 0.6);

    // 1. Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([truckLat, truckLng], 12);

      // Add CartoDB Dark Matter tile layer for AAA dark gaming aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers/layers before re-drawing
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // 2. Custom Neon HTML Markers
    const warehouseIcon = L.divIcon({
      className: 'custom-warehouse-marker',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.6)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
            <path d="M3 7l9-4 9 4"/>
            <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
          </svg>
          <span class="absolute -bottom-5 text-[10px] font-extrabold text-cyan-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">Warehouse</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const truckIcon = L.divIcon({
      className: 'custom-truck-marker',
      html: `
        <div class="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-300 text-white shadow-[0_0_20px_rgba(37,99,235,0.9)] animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-4v10"/>
            <circle cx="7" cy="18" r="2"/>
            <circle cx="17" cy="18" r="2"/>
          </svg>
          <span class="absolute -bottom-6 text-[10px] font-black text-blue-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-blue-400/50 whitespace-nowrap shadow-lg">In Transit</span>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const customerIcon = L.divIcon({
      className: 'custom-customer-marker',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="absolute -bottom-5 text-[10px] font-extrabold text-emerald-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-emerald-500/40 whitespace-nowrap">Destination</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // 3. Add Markers to Map
    const warehouseMarker = L.marker([warehouseLat, warehouseLng], { icon: warehouseIcon }).addTo(map);
    warehouseMarker.bindPopup(`<b>${warehouse?.name || 'Warehouse'}</b><br/>${warehouse?.address || ''}`);

    const truckMarker = L.marker([truckLat, truckLng], { icon: truckIcon }).addTo(map);
    truckMarker.bindPopup('<b>GameHub Courier Truck</b><br/>Live GPS Location');

    const customerMarker = L.marker([customerLat, customerLng], { icon: customerIcon }).addTo(map);
    customerMarker.bindPopup(`<b>Delivery Address</b><br/>${customer?.address || ''}`);

    // 4. Draw Neon Route Polyline
    const routePoints = [
      [warehouseLat, warehouseLng],
      [truckLat, truckLng],
      [customerLat, customerLng],
    ];

    // Background glow line
    L.polyline(routePoints, {
      color: '#00e5ff',
      weight: 6,
      opacity: 0.4,
      dashArray: '8, 8',
    }).addTo(map);

    // Foreground solid line
    L.polyline(routePoints, {
      color: '#2563eb',
      weight: 3,
      opacity: 0.9,
    }).addTo(map);

    // 5. Fit bounds to comfortably frame warehouse & customer pin
    const bounds = L.latLngBounds(routePoints);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      // Cleanup on unmount
    };
  }, [warehouse, customer, truck]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}>
      <div ref={mapRef} className="h-full w-full z-10 min-h-[320px]" />
      
      {/* Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 shadow-md">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Live OpenStreetMap Delivery Route</span>
      </div>
    </div>
  );
}
