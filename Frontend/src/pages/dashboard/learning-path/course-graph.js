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

const TopicNode = memo (({ data }) => {
    console.log(data)
    // const LearningPathLOs = LO.score >= consts.PERCENTAGE_TO_PASS_LO ? LearningPathDoneLOs : (page*consts.LOS_PER_PAGE + index == 0 || LOs[page*consts.LOS_PER_PAGE + index - 1].score >= consts.PERCENTAGE_TO_PASS_LO) ? LearningPathProcessLOs : LearningPathLockedLOs;
  return (
    <div style={{backgroundColor: 'red'}}    >
      <NodeResizer minWidth={100} minHeight={100} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: '10px', color: 'red' }}>{data.label}</div>
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
        {/* <Grid
            xs={12}
            md={4}
            key={data.id}
            // style={{BackgroundColor: 'red'}}
>
            <LearningPathLOs id={data.id} topic={data.Topic.title} learningObject={data.name} finished={data.score} />
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
        /> */}
      </div>
      {/* </Grid> */}
    </div>
  );
})

const nodeCustomTypes = {
  topicNode: TopicNode
}

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1-data' }, style: {
    borderRadius: '20%',
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }, },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2-data' }, style: {
    borderRadius: '20%',
    backgroundColor: '#fff',
    textColor: "red",
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }, },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '3' }];

const nodeCustomType = {
  default: {
    style :{
        radius: 10
    }
  }
};

const TopicGraph = (props) => {
    const {LOs} = props;
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // console.log(LOs)
    // useEffect(() => {
    //   let node = [], edge =[]
    //   for (let i = 0; i < LOs.length - 1; i++) {
    //     node.push({id: String(LOs[i].id), position: {x: 200*i, y: 50}, data: {data: LOs[i]}})
        
    //       edge.push({
    //         id: `e${LOs[i]}-${LOs[i].id}`, 
    //         source: `${LOs[i].id}`, 
    //         target: `${LOs[i+1].id}`
    //     })
    //   }

    //   setNodes(node)
    //   setEdges(edge)
    // }, [LOs])

    return (
        <Card>
            <CardContent style={{height: '500px'}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    attributionPosition="top-right"
                    // fitView={true}
                    nodeType={nodeCustomTypes}
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </CardContent>
        </Card>
    )
}

export default TopicGraph;
