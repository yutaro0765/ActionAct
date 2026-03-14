import { Node, Edge } from '@xyflow/react';

export interface CanvasData {
  nodes: Node[];
  edges: Edge[];
}

export interface OrganizePort {
  // 指定した canvasId のデータを購読する（Mock/Real両対応）
  subscribeTree: (
    canvasId: string, 
    onUpdate: (data: CanvasData) => void
  ) => () => void; // 戻り値は unsubscribe 関数
  
  // ノードの更新操作などのインターフェース
  updateNode: (canvasId: string, nodes: Node[]) => Promise<void>;
}