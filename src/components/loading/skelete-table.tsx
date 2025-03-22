import { FC } from 'react'
import { Box, Skeleton } from '@mui/material';

type SkeletonProps = {
  count: number;
  height: string | number;
}

const SkeletonTable : FC<SkeletonProps> = ({count, height}) => {
  return (
    <Box>
      {[...Array(count)].map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={height} sx={{ my: 1, borderRadius: 1 }} />
      ))}
    </Box>
  );
};

export default SkeletonTable