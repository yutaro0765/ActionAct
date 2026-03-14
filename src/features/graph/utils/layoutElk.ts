import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from '@xyflow/react';

const elk = new ELK();

export const getLayoutedElements = async (nodes: Node[], edges: Edge[]) => {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT', // 左から右へ流れるレイアウト
      'elk.spacing.nodeNode': '80',
      'elk.layered.spacing.nodeNodeLayered': '100',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: 180,  // ノードの想定幅
      height: 60,  // ノードの想定高さ
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