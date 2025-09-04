'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type Tech = 'ReactJS' | 'NodeJS' | 'AI/ML';
type CountryData = Record<string, Tech>;

// Categorical user data
const userData: CountryData = {
  Afghanistan: 'ReactJS',
  India: 'NodeJS',
  China: 'AI/ML',
  Brazil: 'NodeJS',
  Russia: 'ReactJS',
  'United States': 'AI/ML',
  Canada: 'AI/ML',
  Germany: 'ReactJS',
  France: 'ReactJS',
  'United Kingdom': 'AI/ML',
  Australia: 'ReactJS',
  Japan: 'ReactJS',
  'South Korea': 'ReactJS',
  Mexico: 'NodeJS',
  Nigeria: 'ReactJS',
  Egypt: 'NodeJS',
  'South Africa': 'ReactJS',
  Indonesia: 'NodeJS',
  Pakistan: 'NodeJS',
  Bangladesh: 'ReactJS',
  Vietnam: 'NodeJS',
  Argentina: 'NodeJS',
  'Saudi Arabia': 'AI/ML',
  Turkey: 'NodeJS',
  Iran: 'NodeJS',
  Ukraine: 'ReactJS',
  Spain: 'ReactJS',
  Italy: 'ReactJS',
  Poland: 'ReactJS',
  Kenya: 'ReactJS',
};

const HeatMapD3: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [geoData, setGeoData] =
    useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    d3.json<GeoJSON.FeatureCollection<GeoJSON.Geometry>>('/world.geojson').then(
      data => {
        if (data) setGeoData(data);
      }
    );
  }, []);

  // Render map
  useEffect(() => {
    if (!geoData || !svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Keep it consistent with the viewBox for simplicity
    const width = 800;
    const height = 450;

    const projection = d3
      .geoMercator()
      .center([0, 20]) // world-ish center
      .scale(130) // fits the 800x450 viewBox well
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Ordinal color scale for categorical tech values
    const techDomain: Tech[] = ['ReactJS', 'NodeJS', 'AI/ML'];
    const colorScale = d3
      .scaleOrdinal<Tech, string>()
      .domain(techDomain)
      .range(['#4CAF50', '#FF9800', '#3F51B5'])
      .unknown('#eee');

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 0)');

    const tooltip = tooltipRef.current;

    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr(
        'd',
        (d: GeoJSON.Feature<GeoJSON.Geometry>) => pathGenerator(d) || ''
      )
      .attr('fill', d => {
        const name = (d.properties as { name?: string })?.name ?? '';
        const tech = userData[name];
        return colorScale(tech as Tech);
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .on('mouseenter', (event: MouseEvent, d) => {
        const name = (d.properties as { name?: string })?.name ?? 'Unknown';
        const tech = userData[name];
        tooltip.style.opacity = '1';
        tooltip.innerHTML = `<strong>${name}</strong><br/>Technology: ${
          tech ?? 'N/A'
        }`;
      })
      .on('mousemove', (event: MouseEvent) => {
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
      })
      .on('mouseleave', () => {
        tooltip.style.opacity = '0';
      });

    // Labels for countries that have data
    const labeled = geoData.features.filter(d => {
      const name = (d.properties as { name?: string })?.name ?? '';
      return Boolean(userData[name]);
    });

    const labels = g
      .selectAll<SVGGElement, GeoJSON.Feature<GeoJSON.Geometry>>(
        'g.country-label'
      )
      .data(labeled)
      .join('g')
      .attr('class', 'country-label')
      .attr('transform', d => {
        const c = pathGenerator.centroid(d) as [number, number] | [number] | [];
        const x = Number.isFinite(c[0]) ? (c[0] as number) : 0;
        const y = Number.isFinite(c[1]) ? (c[1] as number) : 0;
        return `translate(${x}, ${y})`;
      });

    labels.each(function (d) {
      const name = (d.properties as { name?: string })?.name ?? '';
      const value = userData[name] as Tech;

      const gSel = d3.select(this);

      // Background rectangle
      gSel
        .append('rect')
        .attr('x', -28)
        .attr('y', -12)
        .attr('width', 56)
        .attr('height', 24)
        .attr('rx', 4)
        .attr('fill', '#1f514c')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

      // Down arrow
      gSel
        .append('polygon')
        .attr('points', '-4,12 4,12 0,18')
        .attr('fill', '#1f514c')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

      // Value text
      gSel
        .append('text')
        .text(value)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none');
    });
  }, [geoData]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        overflow: 'hidden',
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '13px',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 99999,
        }}
      />
    </div>
  );
};

export default HeatMapD3;
