import { Box, measureElement, useFocusManager, useInput } from 'ink';
import React, { ReactNode, useEffect, useState } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return {
        ...state,
        scrollTop: 0,
      }
    case 'SET_INNER_HEIGHT':
      return {
        ...state,
        innerHeight: action.innerHeight
      };

    case 'SCROLL_DOWN':
      return {
        ...state,
        scrollTop: Math.min(
          state.innerHeight - state.height,
          state.scrollTop + 3
        )
      };

    case 'SCROLL_UP':
      return {
        ...state,
        scrollTop: Math.max(0, state.scrollTop - 3)
      };

    default:
      return state;
  }
};

export function ScrollArea({height, isStart, children}) {
  const [state, dispatch] = React.useReducer(reducer, {
    height: 10,
    scrollTop: 0,
  });
  const focusManager = useFocusManager();
  const [canScroll, setCanScroll] = useState(true);

  focusManager.enableFocus();

  const innerRef = React.useRef();

  useEffect(() => {
    if (isStart || (children.length + 3) * 3 < (height - 6)) {
      setCanScroll(false);
      dispatch({
        type: 'RESET'
      })
    } else {
      setCanScroll(true);
    }
  }, [height, isStart, children.length]);

  React.useEffect(() => {
    const dimensions = measureElement(innerRef.current);

    dispatch({
      type: 'SET_INNER_HEIGHT',
      innerHeight: dimensions.height
    });
  }, []);

  useInput((_input, key) => {
    if (!canScroll) {
      return;
    }

    if (key.downArrow) {
      dispatch({
        type: 'SCROLL_DOWN'
      });
    }

    if (key.upArrow) {
      dispatch({
        type: 'SCROLL_UP'
      });
    }
  });

  return (
    <Box height={height} flexDirection="column" overflow="hidden">
      <Box
        ref={innerRef}
        flexShrink={0}
        flexDirection="column"
        marginTop={-state.scrollTop}
      >
        {children}
      </Box>
    </Box>
  );
}
