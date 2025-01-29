import { Box, measureElement, useFocusManager, useInput } from 'ink';
import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react';

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
          state.scrollTop + 1
        )
      };

    case 'SCROLL_UP':
      return {
        ...state,
        scrollTop: Math.max(0, state.scrollTop - 1)
      };

    default:
      return state;
  }
};

export function ScrollArea({height, isStart, children, editingMode}) {
  const [state, dispatch] = React.useReducer(reducer, {
    height: 10,
    scrollTop: 0,
  });
  const focusManager = useFocusManager();
  const [canScroll, setCanScroll] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const innerRef = React.useRef();

  useLayoutEffect(() => {
    // Couple of custom logic baked into here to improve the user experience
    // isStart ensures that the first down event will not scroll. This is because initially nothing has focus so the first down gives focus to the first element
    // The children.length calculation calculates a rough estimate of the total height. The 3 is the height of the buttons at the bottom.
    if (isStart || (children.length) * 1 + 3 * 3 < (height - 6)) {
      setCanScroll(false);
      dispatch({
        type: 'RESET'
      })
    } else {
      setCanScroll(true);
    }

    focusManager.enableFocus();
  }, [height, isStart, children.length]);

  // Scroll to the top when entering or exiting edit mode
  if (!isEditing && editingMode) {
    setIsEditing(true);
    dispatch({ type: 'RESET' })
  } else if (isEditing && !editingMode) {
    setIsEditing(false);
    dispatch({ type: 'RESET' })
  }

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
