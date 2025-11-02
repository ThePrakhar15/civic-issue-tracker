import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import 'leaflet.markercluster';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker colors
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const IssueMap = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const center = [28.6139, 77.2090]; // Delhi coordinates

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const { API_ENDPOINTS } = await import('../utils/config');
      const response = await axios.get(API_ENDPOINTS.ISSUES.LIST);
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
      // Fallback to sample data if backend fails
      setIssues([
        { id: 1, title: "Pothole on Main Road", issue_type: "pothole", latitude: 28.6139, longitude: 77.2090, status: "open" },
        { id: 2, title: "Garbage Pileup", issue_type: "garbage", latitude: 28.6145, longitude: 77.2085, status: "open" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'pothole': return '#eab308'; // Yellow
      case 'garbage': return '#ef4444'; // Red
      case 'streetlight': return '#22c55e'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  // Clustering component
  const MarkerCluster = ({ markers }) => {
    const map = useMap();
    const clusterGroupRef = useRef(null);

    useEffect(() => {
      if (!map) return;

      // Remove existing cluster group if it exists
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }

      // Create new cluster group
      const clusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50
      });

      markers.forEach((issue) => {
        const marker = L.marker([issue.latitude, issue.longitude], {
          icon: createCustomIcon(getMarkerColor(issue.issue_type))
        });

        const popupContent = `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">${issue.title || 'Untitled Issue'}</h3>
            <p style="margin: 5px 0; font-size: 14px;">
              <strong>Type:</strong> ${(issue.issue_type || '').charAt(0).toUpperCase() + (issue.issue_type || '').slice(1)}
            </p>
            <p style="margin: 5px 0; font-size: 14px;">
              <strong>Status:</strong> 
              <span style="color: ${issue.status === 'resolved' ? 'green' : 
                                   issue.status === 'rejected' ? 'red' :
                                   issue.status === 'in_progress' ? 'blue' : 'orange'};
                    font-weight: bold; margin-left: 5px; text-transform: capitalize;">
                ${issue.status === 'in_progress' ? 'In Progress' : (issue.status || 'open')}
              </span>
            </p>
            <p style="margin: 5px 0; font-size: 12px; color: #666;">
              Reported by: ${issue.user?.name || 'Unknown'}
            </p>
            ${issue.image ? `<img src="${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${issue.image}" alt="${issue.title || 'Issue'}" style="width: 100%; border-radius: 5px; margin-top: 5px;" />` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;

      return () => {
        if (clusterGroupRef.current) {
          map.removeLayer(clusterGroupRef.current);
          clusterGroupRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, markers]);

    return null;
  };

  if (loading) {
    return (
      <div style={{ 
        height: '500px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f3f4f6',
        borderRadius: '10px'
      }}>
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerCluster markers={issues} />
      </MapContainer>
    </div>
  );
};

export default IssueMap;