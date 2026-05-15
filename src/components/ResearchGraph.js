'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ResearchGraph({ data }) {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef(null);

    // Dynamic sizing based on container
    useEffect(() => {
        if (!containerRef.current) return;
        
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Format data for the graph
    useEffect(() => {
        if (!data) return;
        
        const nodes = data.nodes.map(node => ({ ...node }));
        const links = data.links.map(link => ({ ...link }));
        
        setGraphData({ nodes, links });
    }, [data]);

    // Custom node rendering
    const paintNode = useCallback((node, ctx, globalScale) => {
        const label = node.label;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        
        // Define node colors by type
        let color = '#3b82f6'; // Concept: blue
        let radius = 6;
        
        if (node.type === 'project') {
            color = node.status === 'active' ? '#10b981' : '#78716c'; // Emerald or Stone
            radius = 10;
        } else if (node.type === 'tool') {
            color = '#f59e0b'; // Amber
            radius = 5;
        } else if (node.type === 'domain') {
            color = '#8b5cf6'; // Purple
            radius = 8;
        }

        // Pulse effect for active projects (could be animated later, static for now)
        if (node.type === 'project' && node.status === 'active') {
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.fill();
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Draw label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1c1917'; // Dark stone
        
        // Add a subtle white background to text for readability
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - radius - fontSize - bckgDimensions[1] / 2, ...bckgDimensions);
        
        ctx.fillStyle = '#1c1917';
        ctx.fillText(label, node.x, node.y - radius - fontSize / 2);
    }, []);

    // Custom link rendering
    const paintLink = useCallback((link, ctx, globalScale) => {
        const start = link.source;
        const end = link.target;
        
        if (typeof start !== 'object' || typeof end !== 'object') return; // Wait for initialization

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = '#d6d3d1'; // Stone-300
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();

        // Draw link label (optional, could be noisy)
        if (link.label && globalScale > 1.5) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const fontSize = 8 / globalScale;
            ctx.font = `italic ${fontSize}px Sans-Serif`;
            ctx.fillStyle = '#a8a29e'; // Stone-400
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text background
            const textWidth = ctx.measureText(link.label).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(midX - textWidth / 2 - 2, midY - fontSize / 2 - 2, textWidth + 4, fontSize + 4);
            
            ctx.fillStyle = '#78716c';
            ctx.fillText(link.label, midX, midY);
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-[600px] border border-stone-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-stone-50/50 dark:bg-neutral-900/50 shadow-inner relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-stone-200 dark:border-neutral-800 shadow-sm text-xs space-y-1">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span className="text-stone-700 dark:text-stone-300">Active Project</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-stone-500"></div> <span className="text-stone-700 dark:text-stone-300">Past Project</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> <span className="text-stone-700 dark:text-stone-300">Domain</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> <span className="text-stone-700 dark:text-stone-300">Concept</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> <span className="text-stone-700 dark:text-stone-300">Tool</span></div>
            </div>
            
            <ForceGraph2D
                graphData={graphData}
                width={dimensions.width}
                height={dimensions.height}
                nodeCanvasObject={paintNode}
                linkCanvasObject={paintLink}
                nodeRelSize={6}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                cooldownTicks={100}
                onNodeClick={(node) => {
                    // Optional: could center on node or show details
                    console.log('Clicked node', node);
                }}
            />
        </div>
    );
}
