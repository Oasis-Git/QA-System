import { useRef, useEffect } from "react";

// ----------------------------------------------------------------------

export default function useIsMountedRef(): React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  return isMounted;
}
