import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
// import { Handle } from 'react-flow';

const CardNode = ({ data }) => {
  return (
    <div style={{ minWidth: 150 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div">
            {data.label}
          </Typography>
        </CardContent>
      </Card>
      {/* <Handle type="target" position="left" style={{ background: '#555' }} />
      <Handle type="source" position="right" style={{ background: '#555' }} /> */}
    </div>
  );
};

export default CardNode;
