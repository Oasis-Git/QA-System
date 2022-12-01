import * as React from "react";
import { Suspense } from "react";
import LoadingScreen from "./LoadingScreen";

const Loadable =
  (Component: React.ElementType) =>
  (props: unknown): JSX.Element => {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
export default Loadable;
