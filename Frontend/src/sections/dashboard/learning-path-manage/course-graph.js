import { Card, CardContent } from "@mui/material";
import React, { useCallback, memo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  NodeResizer
} from 'reactflow';
import 'reactflow/dist/style.css';

function TopicNode({ data }) {
  return (
    <>
      <NodeResizer minWidth={50} minHeight={50} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          justifyContent: 'space-evenly',
          left: 0,
        }}
      >
        <Handle
          style={{ position: 'relative', left: 0, transform: 'none' }}
          id="a"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={{ position: 'relative', left: 0, transform: 'none' }}
          id="b"
          type="source"
          position={Position.Bottom}
        />
      </div>
    </>
  );
}

const nodeCustomTypes = {
  topicNode: TopicNode
}

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1-data' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2-data' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '3' }];

const nodeCustomType = {
  default: {
    style :{
        radius: 10
    }
  }
};

export const TopicGraph = (props) => {
    const {topics} = props;
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
      let node = [], edge =[]
      for (let i = 0; i < topics.length; i++) {
        node.push({id: String(topics[i].id), position: {x: 200*i, y: 50}, data: {label: topics[i].title}})
        
        for(let j = 0; j < topics[i].preTopicIds.length; j++) 
          edge.push({
            id: `e${topics[i].preTopicIds[j]}-${topics[i].id}`, 
            source: `${topics[i].preTopicIds[j]}`, 
            target: `${topics[i].id}`
          })
      }

      setNodes(node)
      setEdges(edge)
    }, [topics])

    return (
        <Card>
            <CardContent style={{height: '300px'}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    attributionPosition="top-right"
                    // fitView={true}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </CardContent>
        </Card>
    )
}