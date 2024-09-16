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
import { LearningPathDoneLOs } from "./learning-path-done-LOs";
import { LearningPathProcessLOs } from "./learning-path-process-LOs";
import { LearningPathLockedLOs } from "./learning-path-locked-LOs";

const elk = new ELK();
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

function LearningPathNode({ data }) {
  return (
    <div style={{margin: ['50px', '50px', '50px', '50px'], zIndex: 2, backgroundColor: 'white'}}>
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

function LearningPathDone({data}) {
    return (
        <>
            <LearningPathDoneLOs id={data.id} topic={data.topic} learningObject={data.learningObject} finished={data.finished} />
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </>
    )
}

function LearningPathProcess({data}) {
    return (
        <>
            <LearningPathProcessLOs id={data.id} topic={data.topic} learningObject={data.learningObject} finished={data.finished} />
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </>
    )
}

function LearningPathLocked({data}) {
    return (
        <>
            <LearningPathLockedLOs id={data.id} topic={data.topic} learningObject={data.learningObject} finished={data.finished} />
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </>
    )
}



const nodeCustomTypes = {
  topicNode: LearningPathNode,  
  doneNode: LearningPathDone,
  processNode: LearningPathProcess,
  lockNode: LearningPathLocked
}

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1-data' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2-data' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '3' }];

export const LearningPathGraph = (props) => {
    const {LOs} = props;
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
        for (let i = 0; i < LOs.length - 1; i++) {
            if (down === 5) {
                down = 0;
                layer += 250
            }

            const nodeType = LOs[i].score >= LOs[i].percentOfPass ? "doneNode" : (LOs[i - 1].score >= LOs[i].percentOfPass) ? "processNode" : "lockNode";
            
            node.push({
                id: String(LOs[i].id), 
                type: nodeType, 
                position: {x: 500*down, y: layer}, 
                data: {
                    id: LOs[i].id,
                    topic: LOs[i].Topic.title,
                    learningObject: LOs[i].name,
                    finished: LOs[i].score
                }
            })
            
            edge.push({
                id: `e${LOs[i].id}-${LOs[i + 1].id}`, 
                source: `${LOs[i].id}`, 
                target: `${LOs[i + 1].id}`,
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
            down += 1
        }

        setNodes(node)
        setEdges(edge)
    }, [LOs])

    return (
        <Card>
            <CardContent style={{height: '700px', backgroundColor: theme.palette.action.hover}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}   
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    attributionPosition="top-right"
                    nodeTypes={nodeCustomTypes}
                    fitView={true}
                    panOnScroll={true}
                >
                    {/* <Controls /> */}
                    {/* <Background style={{backgroundColor: theme.palette.action.hover}}/> */}
                </ReactFlow>
            </CardContent>
        </Card>
    )
}