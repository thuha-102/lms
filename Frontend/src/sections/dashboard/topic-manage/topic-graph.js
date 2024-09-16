import { Card, CardContent } from "@mui/material";
import React, { useCallback, memo, useEffect } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  NodeResizer,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from '@mui/material/styles';

function TopicNode({ data }) {
  const theme = useTheme()
  return (
    <div style={{margin: ['50px', '50px', '50px', '50px'], zIndex: 2, backgroundColor: theme.palette.primary.main}}>
      <NodeResizer minWidth={50} minHeight={50}/>
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      {/* <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          justifyContent: 'space-evenly',
          left: 0,
        }}
      > */}
        <Handle
          // style={{ position: 'relative', left: 0, transform: 'none' }}
          // id="a"
          type="source"
          position={Position.Right}
        />
      {/* </div> */}
    </div>
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

export const TopicGraph = (props) => {
    const {topics} = props;
    const theme = useTheme()
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
      let node = [], edge =[]
      let layer = 0, down = 0;

      for (let i = 0; i < topics.length; i++) {
        down += 1
        if (down === 10) {
          down = 0;
          layer += 100
        }

        node.push({id: String(topics[i].id), type: 'topicNode', position: {x: 400*down, y: layer}, data: {label: topics[i].title}})
        
        for(let j = 0; j < topics[i].preTopicIds.length; j++) 
          edge.push({
            id: `e${topics[i].preTopicIds[j]}-${topics[i].id}`, 
            source: `${topics[i].preTopicIds[j]}`, 
            target: `${topics[i].id}`,
            type: 'straight',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: theme.palette.primary.main
            },
            style: {
              strokeWidth: 2,
              stroke: theme.palette.primary.main,
            },
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
                    nodeTypes={nodeCustomTypes}
                    // fitView={true}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </CardContent>
        </Card>
    )
}