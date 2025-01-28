import { Box } from 'ink';
import React from 'react';
import { useEffect, useState } from 'react';

export function FullScreen(props) {
  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    }

    process.stdout.on("resize", onResize);
    process.stdout.write("\x1b[?1049h");
    process.stdout.write("\x1b[?1000h");
    return () => {
      process.stdout.off("resize", onResize);
      process.stdout.write("\x1b[?1049l");
      process.stdout.write("\x1b[?1000l");
    };
  }, []);

  return (
    <Box width={size.columns} height={size.rows}>
      {props.children}
    </Box>
  );
}
