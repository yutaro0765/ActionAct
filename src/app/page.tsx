"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Panel, 
  type Node, 
  type Edge,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ELK from 'elkjs/lib/elk.bundled.js';

import { organizeService } from '@/services/organize';
import { MarkdownPane } from '@/features/nodeMarkdown/components/MarkdownPane';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup as OriginalResizablePanelGroup 
} from "@/components/ui/resizable";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Share2, Wand2 } from 'lucide-react';

const elk = new ELK();

// 型エラー回避用
const ResizablePanelGroup = OriginalResizablePanelGroup as any;

/**
 * ELKjsを使用してノードを整列させる関数
 */
const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeLayered': '100',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: 180,
      height: 80,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  return nodes.map((node) => {
    const nodeWithPosition = layoutedGraph.children?.find((n) => n.id === node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition?.x || 0,
        y: nodeWithPosition?.y || 0,
      },
    };
  });
};

export default function SPAHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasId = searchParams.get('canvasId') || 'root';

  /** * 【修正ポイント】 ジェネリクス <Node>, <Edge> を追加して 
   * never[] 型になるのを防ぎます
   */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [selectedContent, setSelectedContent] = useState<string>("ノードを選択してください");

  useEffect(() => {
    const unsubscribe = organizeService.subscribeTree(canvasId, async (data) => {
      // getLayoutedElements を実行
      const layoutedNodes = await getLayoutedElements(data.nodes, data.edges);
      
      // ここでの型エラーが消えるはずです
      setNodes(layoutedNodes);
      setEdges(data.edges);
      
      if (layoutedNodes.length > 0) {
        const firstContent = (layoutedNodes[0].data as any)?.contentMarkdown;
        if (firstContent) setSelectedContent(firstContent);
      }
    });
    return () => unsubscribe();
  }, [canvasId, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const nextId = (node.data as any)?.nextCanvasId;
    if (nextId) {
      router.push(`/?canvasId=${nextId}`);
      toast.info(`階層移動: ${nextId}`);
    }

    const content = (node.data as any)?.contentMarkdown;
    if (typeof content === 'string') {
      setSelectedContent(content);
    }
  }, [router]);

  const handleRelayout = async () => {
    const layoutedNodes = await getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    toast.success("レイアウトを整列しました");
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70} minSize={30}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}> 
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
              style={{ width: '100%', height: '100%' }}
            >
              <Background />
              <Controls />
              <Panel position="top-right" className="flex flex-col gap-2 bg-white/90 p-3 rounded-lg border shadow-sm">
                <div className="text-[10px] text-slate-400 font-mono uppercase">ID: {canvasId}</div>
                <div className="flex gap-2">
                  <Button onClick={handleRelayout} size="sm" variant="outline" className="h-8">
                    <Wand2 className="w-3 h-3 mr-2" /> 整列
                  </Button>
                  <Button onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("共有リンクをコピーしました");
                  }} size="sm" variant="default" className="h-8">
                    <Share2 className="w-3 h-3 mr-2" /> 共有
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={20} className="bg-slate-50 border-l">
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="p-3 border-b bg-white text-xs font-bold text-slate-500 flex justify-between items-center">
              <span>NODE DETAILS</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <MarkdownPane content={selectedContent} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}