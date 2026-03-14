import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

// モックデータ: canvasId ごとに表示する内容を定義
const mockData: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  root: {
    nodes: [
      { id: '1', position: { x: 100, y: 100 }, data: { label: '📂 プロジェクト全体 (クリックで展開)', nextId: 'sub-1' }, type: 'default' },
      { id: '2', position: { x: 400, y: 150 }, data: { label: '📂 別のキャンバス', nextId: 'sub-2' }, type: 'default' },
    ],
    edges: [],
  },
  'sub-1': {
    nodes: [
      { id: 's1-1', position: { x: 100, y: 50 }, data: { label: '✅ タスクA' } },
      { id: 's1-2', position: { x: 100, y: 150 }, data: { label: '✅ タスクB' } },
      { id: 'back', position: { x: 300, y: 300 }, data: { label: '⬅️ 戻る', nextId: 'root' } },
    ],
    edges: [],
  },
  'sub-2': {
    nodes: [
      { id: 's2-1', position: { x: 100, y: 100 }, data: { label: '📄 詳細ドキュメント' } },
      { id: 'back', position: { x: 100, y: 200 }, data: { label: '⬅️ 戻る', nextId: 'root' } },
    ],
    edges: [],
  }
};

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  loadCanvas: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  loadCanvas: (id: string) => {
    const data = mockData[id] || mockData['root'];
    set({ nodes: data.nodes, edges: data.edges });
  },
}));