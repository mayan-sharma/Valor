import React from 'react'
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, percentageuploaded }) => (
  uploadState === 'uploading' && (
    <Progress
      className="progress__bar"
      percent={percentageuploaded}
      progress
      indicating
      size='medium'
      inverted
    />
  )
);

export default ProgressBar;