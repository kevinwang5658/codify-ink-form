import { Box, BoxProps } from 'ink';
import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { useEffect, useState } from 'react';

function useStdoutDimensions(): [number, number] {
  const {columns, rows} = process.stdout;
  const [size, setSize] = useState({columns, rows});
  useEffect(() => {
    function onResize() {
      const {columns, rows} = process.stdout;
      setSize({columns, rows});
    }
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);
  return [size.columns, size.rows];
}

export const FullScreen: React.FC<PropsWithChildren<BoxProps>> = ({children, ...styles}) => {
  const [columns, rows] = useStdoutDimensions();
  return <Box width={columns} height={rows} {...styles}>{children}</Box>;
}
