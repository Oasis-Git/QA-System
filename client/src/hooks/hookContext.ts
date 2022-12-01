import React, { useContext } from "react";

const hookContext =
  <ContextType>(Context: React.Context<ContextType | null>, name: string) =>
  (): ContextType => {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`\`${name}Context\` 需要在 \`${name}Provider\` 中使用`);
    }
    return context;
  };

export default hookContext;
