import { OrganizePort, CanvasData } from './port';
import { nanoid } from 'nanoid'; // 必要なら npm install nanoid

export const mockOrganizeService: OrganizePort = {
  subscribeTree: (canvasId, onUpdate) => {
    console.log(`[Mock] Subscribing to: ${canvasId}`);

    // IDに基づいてデータを生成
    const isRoot = canvasId === 'root';
    const data: CanvasData = {
      nodes: [
        {
          id: 'main-content',
          type: 'default',
          position: { x: 0, y: 0 },
          data: { 
            label: isRoot ? "🌳 ルート知識" : `階層: ${canvasId}`,
            contentMarkdown: `# ${canvasId}\n\nこれはモックデータです。\n- **要点**: 階層構造のデモ\n- **詳細**: [リンクテスト](node://next-level)`,
          }
        },
        {
          id: 'next-level',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { 
            label: "🔍 下位ノード (クリックで展開)", 
            nextCanvasId: isRoot ? "sub-topic-alpha" : `${canvasId}-detail` 
          }
        }
      ],
      edges: [
        { id: 'e1', source: 'main-content', target: 'next-level', animated: true }
      ]
    };

    // 擬似的に即時配信
    onUpdate(data);

    // Unsubscribe時は何もしない
    return () => console.log(`[Mock] Unsubscribed from: ${canvasId}`);
  },

  updateNode: async () => { /* モックなので保存はログのみ */ }
};